package config

import (
	"os"
	"strconv"
)

// Config holds all server configuration values loaded from environment variables.
type Config struct {
	Port                   string
	FrontendURL            string
	DownloadTestMaxSeconds int
	UploadTestMaxBytes     int64
	RateLimitEnabled       bool
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	return &Config{
		Port:                   getEnv("BACKEND_PORT", "8080"),
		FrontendURL:            getEnv("FRONTEND_URL", "http://localhost:3000"),
		DownloadTestMaxSeconds: getEnvInt("DOWNLOAD_TEST_MAX_SECONDS", 10),
		UploadTestMaxBytes:     getEnvInt64("UPLOAD_TEST_MAX_BYTES", 200_000_000),
		RateLimitEnabled:       getEnvBool("RATE_LIMIT_ENABLED", true),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}

func getEnvInt64(key string, fallback int64) int64 {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.ParseInt(v, 10, 64); err == nil {
			return i
		}
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}
