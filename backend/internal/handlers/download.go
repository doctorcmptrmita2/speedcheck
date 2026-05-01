package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/speedcheck-dev/backend/internal/speedtest"
)

// DownloadHandler streams random bytes to the client for download speed measurement.
// The stream duration is controlled by the "duration" query parameter (default: 10s).
func DownloadHandler(maxSeconds int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse duration from query parameter
		duration := time.Duration(maxSeconds) * time.Second
		if d := r.URL.Query().Get("duration"); d != "" {
			if secs, err := strconv.Atoi(d); err == nil && secs > 0 {
				requested := time.Duration(secs) * time.Second
				if requested < duration {
					duration = requested
				}
			}
		}

		// Cap at maximum allowed duration
		if duration > speedtest.MaxDownloadDuration {
			duration = speedtest.MaxDownloadDuration
		}

		// Set headers to prevent caching and indicate binary stream
		w.Header().Set("Content-Type", "application/octet-stream")
		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Connection", "keep-alive")

		// Get the shared random buffer (64KB, allocated once)
		buf := speedtest.GetRandomBuffer()

		// Get the flusher if available
		flusher, canFlush := w.(http.Flusher)

		// Stream until duration expires or client disconnects
		ctx := r.Context()
		deadline := time.Now().Add(duration)

		for {
			select {
			case <-ctx.Done():
				return
			default:
				if time.Now().After(deadline) {
					return
				}
				_, err := w.Write(buf)
				if err != nil {
					return
				}
				if canFlush {
					flusher.Flush()
				}
			}
		}
	}
}
