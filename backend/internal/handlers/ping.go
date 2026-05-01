package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

// PingResponse is the response payload for the ping endpoint.
type PingResponse struct {
	OK        bool  `json:"ok"`
	Timestamp int64 `json:"timestamp"`
}

// PingHandler returns a minimal JSON response for latency measurement.
func PingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(PingResponse{
		OK:        true,
		Timestamp: time.Now().UnixMilli(),
	})
}
