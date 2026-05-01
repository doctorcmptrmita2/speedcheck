package middleware

import (
	"context"
	"net/http"
	"time"
)

// Timeout returns a middleware that cancels the request context after the given duration.
// Note: This does NOT use http.TimeoutHandler because that buffers the response,
// which is incompatible with our streaming download endpoint.
func Timeout(d time.Duration) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx, cancel := context.WithTimeout(r.Context(), d)
			defer cancel()
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
