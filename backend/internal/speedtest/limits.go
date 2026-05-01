package speedtest

import "time"

const (
	// MaxDownloadDuration is the absolute maximum duration for a download test.
	MaxDownloadDuration = 15 * time.Second

	// DefaultDownloadDuration is used when no duration param is specified.
	DefaultDownloadDuration = 10 * time.Second

	// MaxUploadBytes is the absolute maximum upload size (200MB).
	MaxUploadBytes = 200 * 1024 * 1024

	// RequestTimeout is the general request timeout.
	RequestTimeout = 30 * time.Second

	// PingTimeout is the timeout for ping requests.
	PingTimeout = 5 * time.Second
)
