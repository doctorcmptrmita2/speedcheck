# Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build Backend
FROM golang:alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go build -o speedcheck-server ./cmd/server

# Final Image
FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache ca-certificates mailcap
COPY --from=backend-builder /app/speedcheck-server .
COPY --from=frontend-builder /app/frontend/out ./public
RUN mkdir -p data

EXPOSE 8080
ENV BACKEND_PORT=8080
ENV FRONTEND_URL="*"
ENV RATE_LIMIT_ENABLED=true

CMD ["./speedcheck-server"]
