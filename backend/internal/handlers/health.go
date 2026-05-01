package handlers

import (
	"encoding/json"
	"net/http"
)

// HealthResponse is the response payload for the health check endpoint.
type HealthResponse struct {
	Status string `json:"status"`
}

// HealthHandler returns a simple health check response.
func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(HealthResponse{Status: "ok"})
}
