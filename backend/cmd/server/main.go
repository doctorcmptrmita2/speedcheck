package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	_ "modernc.org/sqlite"
)

// ─── Configuration ─────────────────────────────────────────────────────────────

type Config struct {
	Port                   string
	FrontendURL            string
	DownloadTestMaxSeconds int
	UploadTestMaxBytes     int64
	RateLimitEnabled       bool
}

func LoadConfig() *Config {
	return &Config{
		Port:                   getEnv("BACKEND_PORT", "8080"),
		FrontendURL:            getEnv("FRONTEND_URL", "*"),
		DownloadTestMaxSeconds: getEnvInt("DOWNLOAD_TEST_MAX_SECONDS", 10),
		UploadTestMaxBytes:     getEnvInt64("UPLOAD_TEST_MAX_BYTES", 200_000_000),
		RateLimitEnabled:       getEnvBool("RATE_LIMIT_ENABLED", true),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" { return v }
	return fallback
}
func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil { return i }
	}
	return fallback
}
func getEnvInt64(key string, fallback int64) int64 {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.ParseInt(v, 10, 64); err == nil { return i }
	}
	return fallback
}
func getEnvBool(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil { return b }
	}
	return fallback
}

// ─── Database ──────────────────────────────────────────────────────────────────

var DB *sql.DB

func InitDB(dbPath string) error {
	var err error
	DB, err = sql.Open("sqlite", dbPath)
	if err != nil { return err }
	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS results (
		id TEXT PRIMARY KEY,
		download REAL, upload REAL, ping REAL, jitter REAL, quality REAL,
		ip_address TEXT, isp_info TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`)
	return err
}

// ─── Handlers ──────────────────────────────────────────────────────────────────

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func PingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}

func DownloadHandler(maxSeconds int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Content-Disposition", "attachment; filename=test.bin")
		buffer := make([]byte, 64*1024)
		rand.Read(buffer)
		timeout := time.After(time.Duration(maxSeconds) * time.Second)
		for {
			select {
			case <-timeout: return
			case <-r.Context().Done(): return
			default:
				if _, err := w.Write(buffer); err != nil { return }
			}
		}
	}
}

func UploadHandler(maxBytes int64) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := os.Copy(os.Discard, http.MaxBytesReader(w, r.Body, maxBytes))
		if err != nil {
			http.Error(w, "Upload too large", http.StatusRequestEntityTooLarge)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

type TelemetryData struct {
	Download float64 `json:"download"`
	Upload   float64 `json:"upload"`
	Ping     float64 `json:"ping"`
	Jitter   float64 `json:"jitter"`
	Quality  float64 `json:"quality"`
	ISP      string  `json:"isp_info"`
}

func SaveTelemetryHandler(w http.ResponseWriter, r *http.Request) {
	var data TelemetryData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	id := uuid.New().String()
	ip, _, _ := net.SplitHostPort(r.RemoteAddr)
	_, err := DB.Exec(`INSERT INTO results (id, download, upload, ping, jitter, quality, ip_address, isp_info) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, id, data.Download, data.Upload, data.Ping, data.Jitter, data.Quality, ip, data.ISP)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}

func GetTelemetryHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var data TelemetryData
	err := DB.QueryRow(`SELECT download, upload, ping, jitter, quality, isp_info FROM results WHERE id = ?`, id).
		Scan(&data.Download, &data.Upload, &data.Ping, &data.Jitter, &data.Quality, &data.ISP)
	if err != nil {
		http.Error(w, "Result not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

// ─── Middleware ────────────────────────────────────────────────────────────────

func CORSMiddleware(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := allowedOrigin
			if origin == "*" {
				origin = r.Header.Get("Origin")
				if origin == "" { origin = "*" }
			}
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

type RateLimiter struct {
	requests sync.Map
	limit    int
	window   time.Duration
	enabled  bool
}

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !rl.enabled { next.ServeHTTP(w, r); return }
		ip, _, _ := net.SplitHostPort(r.RemoteAddr)
		val, _ := rl.requests.LoadOrStore(ip, []time.Time{})
		times := val.([]time.Time)
		now := time.Now()
		var valid []time.Time
		for _, t := range times {
			if now.Sub(t) < rl.window { valid = append(valid, t) }
		}
		if len(valid) >= rl.limit {
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			return
		}
		rl.requests.Store(ip, append(valid, now))
		next.ServeHTTP(w, r)
	})
}

// ─── Main ──────────────────────────────────────────────────────────────────────

func main() {
	cfg := LoadConfig()
	os.MkdirAll("data", os.ModePerm)
	if err := InitDB("data/speedcheck.db"); err != nil { log.Fatalf("DB fail: %v", err) }

	r := chi.NewRouter()
	r.Use(CORSMiddleware(cfg.FrontendURL))
	limiter := &RateLimiter{limit: 10, window: 10 * time.Minute, enabled: cfg.RateLimitEnabled}

	r.Get("/health", HealthHandler)
	r.Route("/api", func(api chi.Router) {
		api.Get("/ping", PingHandler)
		api.With(limiter.Middleware).Get("/download", DownloadHandler(cfg.DownloadTestMaxSeconds))
		api.With(limiter.Middleware).Post("/upload", UploadHandler(cfg.UploadTestMaxBytes))
		api.Post("/telemetry", SaveTelemetryHandler)
		api.Get("/telemetry/{id}", GetTelemetryHandler)
	})

	// Static Fallback
	fs := http.FileServer(http.Dir("public"))
	r.NotFound(func(w http.ResponseWriter, r *http.Request) { fs.ServeHTTP(w, r) })

	srv := &http.Server{Addr: ":"+cfg.Port, Handler: r}
	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		srv.Shutdown(context.Background())
	}()

	log.Printf("Starting on %s", cfg.Port)
	srv.ListenAndServe()
}
