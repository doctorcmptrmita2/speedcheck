package handlers

import (
	"encoding/json"
	"log"
	"net"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/speedcheck-dev/backend/internal/database"
	"github.com/speedcheck-dev/backend/internal/models"
)

func getIP(r *http.Request) string {
	ip := r.Header.Get("X-Real-Ip")
	if ip == "" {
		ip = r.Header.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip, _, _ = net.SplitHostPort(r.RemoteAddr)
	}
	return ip
}

func SaveTelemetryHandler(w http.ResponseWriter, r *http.Request) {
	var result models.TelemetryResult
	if err := json.NewDecoder(r.Body).Decode(&result); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	result.ID = uuid.New().String()
	ip := getIP(r)

	query := `INSERT INTO results (id, download, upload, ping, jitter, quality, ip_address, isp_info) 
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
	
	_, err := database.DB.Exec(query, result.ID, result.Download, result.Upload, result.Ping, result.Jitter, result.Quality, ip, result.ISPInfo)
	if err != nil {
		log.Printf("DB Insert Error: %v", err)
		http.Error(w, "Failed to save result", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"id": result.ID})
}

func GetTelemetryHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "ID required", http.StatusBadRequest)
		return
	}

	query := `SELECT id, download, upload, ping, jitter, quality, ip_address, isp_info, timestamp FROM results WHERE id = ?`
	row := database.DB.QueryRow(query, id)

	var res models.TelemetryResult
	err := row.Scan(&res.ID, &res.Download, &res.Upload, &res.Ping, &res.Jitter, &res.Quality, &res.IPAddress, &res.ISPInfo, &res.Timestamp)
	if err != nil {
		http.Error(w, "Result not found", http.StatusNotFound)
		return
	}

	// Mask IP address for privacy
	res.IPAddress = "Redacted"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}
