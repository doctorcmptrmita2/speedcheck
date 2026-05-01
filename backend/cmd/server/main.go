package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/speedcheck-dev/backend/internal/config"
	"github.com/speedcheck-dev/backend/internal/database"
	"github.com/speedcheck-dev/backend/internal/handlers"
	"github.com/speedcheck-dev/backend/internal/middleware"
)

func main() {
	cfg := config.Load()

	// Initialize Database
	// We use a local SQLite file in the data/ directory
	os.MkdirAll("data", os.ModePerm)
	if err := database.InitDB("data/speedcheck.db"); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.Logging)
	r.Use(middleware.CORS(cfg.FrontendURL))

	// Rate limiter for test endpoints (10 requests per 10 minutes per IP)
	testLimiter := middleware.NewRateLimiter(10, 10*time.Minute, cfg.RateLimitEnabled)

	// Routes
	r.Get("/health", handlers.HealthHandler)

	// Serve Static Frontend
	fs := http.FileServer(http.Dir("public"))
	r.Handle("/*", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// If the request is for an API or health, chi router will handle it.
		// Otherwise, serve static files.
		fs.ServeHTTP(w, r)
	}))

	r.Route("/api", func(api chi.Router) {
		api.Get("/ping", handlers.PingHandler)

		api.With(testLimiter.Middleware).
			With(middleware.Timeout(30*time.Second)).
			Get("/download", handlers.DownloadHandler(cfg.DownloadTestMaxSeconds))

		api.With(testLimiter.Middleware).
			With(middleware.Timeout(30*time.Second)).
			Post("/upload", handlers.UploadHandler(cfg.UploadTestMaxBytes))
			
		api.Get("/servers", handlers.ServersHandler)
		api.Post("/telemetry", handlers.SaveTelemetryHandler)
		api.Get("/telemetry/{id}", handlers.GetTelemetryHandler)
	})

	// Serve Static Frontend (Fallback)
	fs := http.FileServer(http.Dir("public"))
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	})

	addr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:         addr,
		Handler:      r,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		log.Println("Shutting down server...")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := srv.Shutdown(ctx); err != nil {
			log.Printf("Server shutdown error: %v", err)
		}
	}()

	log.Printf("SpeedCheck.DEV backend starting on %s", addr)
	log.Printf("Allowed frontend origin: %s", cfg.FrontendURL)
	log.Printf("Rate limiting enabled: %v", cfg.RateLimitEnabled)

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}
	log.Println("Server stopped")
}
