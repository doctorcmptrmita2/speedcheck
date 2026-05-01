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
	"github.com/speedcheck-dev/backend/internal/handlers"
	"github.com/speedcheck-dev/backend/internal/middleware"
)

func main() {
	cfg := config.Load()

	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.Logging)
	r.Use(middleware.CORS(cfg.FrontendURL))

	// Rate limiter for test endpoints (10 requests per 10 minutes per IP)
	testLimiter := middleware.NewRateLimiter(10, 10*time.Minute, cfg.RateLimitEnabled)

	// Routes
	r.Get("/health", handlers.HealthHandler)

	r.Route("/api", func(api chi.Router) {
		api.Get("/ping", handlers.PingHandler)

		api.With(testLimiter.Middleware).
			With(middleware.Timeout(30*time.Second)).
			Get("/download", handlers.DownloadHandler(cfg.DownloadTestMaxSeconds))

		api.With(testLimiter.Middleware).
			With(middleware.Timeout(30*time.Second)).
			Post("/upload", handlers.UploadHandler(cfg.UploadTestMaxBytes))
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
