package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

// UploadResponse is the response payload for the upload endpoint.
type UploadResponse struct {
	OK            bool  `json:"ok"`
	BytesReceived int64 `json:"bytesReceived"`
}

// UploadHandler reads and discards the request body, then returns the byte count.
// It enforces a maximum upload size to protect the server.
func UploadHandler(maxBytes int64) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store")

		// Wrap body with MaxBytesReader to enforce upload limit
		r.Body = http.MaxBytesReader(w, r.Body, maxBytes)

		// Read and discard all bytes using a small buffer
		buf := make([]byte, 64*1024) // 64KB read buffer
		var totalBytes int64

		for {
			n, err := r.Body.Read(buf)
			totalBytes += int64(n)
			if err != nil {
				if err == io.EOF {
					break
				}
				// MaxBytesError means the body exceeded our limit
				if _, ok := err.(*http.MaxBytesError); ok {
					w.WriteHeader(http.StatusRequestEntityTooLarge)
					json.NewEncoder(w).Encode(map[string]string{
						"error": "Upload size exceeds maximum allowed",
					})
					return
				}
				// Other read errors (client disconnect, etc.)
				break
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(UploadResponse{
			OK:            true,
			BytesReceived: totalBytes,
		})
	}
}
