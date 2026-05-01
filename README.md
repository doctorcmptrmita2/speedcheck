# SpeedCheck.DEV

> **A fast, modern, privacy-friendly public internet speed test tool.**
> Measure download speed, upload speed, ping, jitter, and connection quality directly from your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

SpeedCheck.DEV is **only** a public internet speed test application.

It does **not** include accounts, dashboards, billing, white-label features, or any SaaS functionality. A user opens the homepage, clicks one button, waits a few seconds, and sees their internet speed results in a beautiful, accurate interface.

---

## Features

- ⚡ **Download speed** — measured via streaming from the server
- ⬆️ **Upload speed** — measured via chunked binary uploads
- 📡 **Ping** — measured with multiple round-trip requests
- 📊 **Jitter** — calculated from ping sample variance
- 🏆 **Quality score** — 0–100 score based on all four metrics
- 🔤 **Connection rating** — Excellent / Good / Fair / Poor
- 🎨 **Premium dark UI** — glassmorphism, SVG speed meter, smooth animations
- 📱 **Fully responsive** — mobile-first design
- 🔒 **Privacy-friendly** — no signup, no personal data stored

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | Next.js 16, TypeScript, Tailwind CSS v4, React 19 |
| Backend   | Go 1.22, chi router                             |
| Container | Docker, Docker Compose                          |

---

## Local Development

### Prerequisites

- **Node.js** 22+
- **Go** 1.22+ (for running backend locally)
- **Docker** & **Docker Compose** (for containerized run)

### Frontend (local)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

The frontend proxies all `/api/*` calls to `http://localhost:8080` by default.

### Backend (local, requires Go)

```bash
cd backend
go run ./cmd/server
# → http://localhost:8080
```

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable                    | Default                    | Description                          |
|-----------------------------|----------------------------|--------------------------------------|
| `BACKEND_PORT`              | `8080`                     | Port the Go server listens on        |
| `FRONTEND_URL`              | `http://localhost:3000`    | Allowed CORS origin                  |
| `DOWNLOAD_TEST_MAX_SECONDS` | `10`                       | Max stream duration for download test |
| `UPLOAD_TEST_MAX_BYTES`     | `200000000`                | Max upload body size (bytes)         |
| `RATE_LIMIT_ENABLED`        | `true`                     | Enable IP-based rate limiting        |
| `NEXT_PUBLIC_API_URL`       | `http://backend:8080`      | Backend URL used in Docker Compose   |

---

## Docker

### Build & Run (recommended)

```bash
# Copy env file
cp .env.example .env

# Build and start both services
docker compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8080
```

### Individual builds

```bash
# Backend only
docker build -t speedcheck-backend ./backend

# Frontend only
docker build -t speedcheck-frontend ./frontend
```

---

## API Endpoints

| Method | Path            | Description                                      |
|--------|-----------------|--------------------------------------------------|
| GET    | `/health`       | Health check — returns `{"status":"ok"}`         |
| GET    | `/api/ping`     | Ping endpoint — returns timestamp for RTT measure |
| GET    | `/api/download` | Streams random bytes for download measurement    |
| POST   | `/api/upload`   | Receives and discards binary data, returns count |

### Query Parameters

`GET /api/download?duration=8` — sets stream duration in seconds (default: 10, max: 15)

---

## Architecture

```
Browser (Next.js)
  │
  ├── GET  /api/ping          (10 requests, measures RTT + jitter)
  ├── GET  /api/download      (streams 64KB chunks for ~8s)
  └── POST /api/upload        (sends 1MB chunks for ~8s)
        │
        ▼
Go Backend (chi router)
  ├── Middleware: CORS, Rate Limit, Logging, Timeout
  ├── handlers/health.go      → /health
  ├── handlers/ping.go        → /api/ping
  ├── handlers/download.go    → /api/download  (streaming, no buffering)
  └── handlers/upload.go      → /api/upload    (read+discard, MaxBytesReader)
```

### Quality Score Algorithm

| Metric   | Max Points | Criteria                                             |
|----------|------------|------------------------------------------------------|
| Download | 35         | ≥100Mbps=35, ≥50=28, ≥25=20, ≥10=12, else 5         |
| Upload   | 25         | ≥30Mbps=25, ≥15=20, ≥5=12, ≥1=6, else 2             |
| Ping     | 25         | ≤20ms=25, ≤50=20, ≤100=12, ≤150=6, else 2           |
| Jitter   | 15         | ≤5ms=15, ≤15=10, ≤30=6, else 2                      |

---

## Security

- Upload size enforced with `http.MaxBytesReader` (200MB limit)
- Request timeouts on all endpoints (30s)
- In-memory IP rate limiting (10 tests/IP/10min on test endpoints)
- CORS restricted to configured frontend origin
- No-store cache headers on all test endpoints
- Uploaded data is immediately discarded — never written to disk
- Request bodies are never logged
- No sensitive data stored anywhere

---

## Limitations

- Rate limiting is in-memory only — resets on server restart
- No persistent test history (by design — privacy-first)
- Download/upload results depend on proximity to the server
- Go is not required locally — use Docker Compose for full-stack run

---

## License

MIT — free to use, modify, and deploy.
