import type {
  SpeedTestResult,
  ConnectionRating,
  TestCallbacks,
} from "./types";

const API_BASE = "";

// ─── Ping Test ──────────────────────────────────────────────────────────────────

/**
 * Runs a ping test by sending multiple small requests to the backend.
 * Returns an array of round-trip times in milliseconds.
 */
export async function runPingTest(
  count: number = 10,
  onProgress?: (pingMs: number) => void
): Promise<number[]> {
  const samples: number[] = [];

  for (let i = 0; i < count + 1; i++) {
    const start = performance.now();
    const resp = await fetch(`${API_BASE}/api/ping?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!resp.ok) {
      throw new Error("Ping request failed");
    }

    await resp.json();
    const rtt = performance.now() - start;

    // Skip the first request (cold connection)
    if (i > 0) {
      samples.push(Math.round(rtt * 100) / 100);
      onProgress?.(Math.round(rtt * 100) / 100);
    }

    // Small delay between pings
    await sleep(100);
  }

  return samples;
}

// ─── Jitter Calculation ─────────────────────────────────────────────────────────

/**
 * Calculates jitter as the average absolute difference between consecutive ping samples.
 */
export function calculateJitter(samples: number[]): number {
  if (samples.length < 2) return 0;

  let totalDiff = 0;
  for (let i = 1; i < samples.length; i++) {
    totalDiff += Math.abs(samples[i] - samples[i - 1]);
  }

  return Math.round((totalDiff / (samples.length - 1)) * 100) / 100;
}

// ─── Download Test ──────────────────────────────────────────────────────────────

/**
 * Runs a download speed test by streaming data from the backend.
 * Reports live Mbps via the onProgress callback.
 * Returns the final measured download speed in Mbps.
 */
export async function runDownloadTest(
  durationSeconds: number = 8,
  onProgress?: (mbps: number) => void
): Promise<number> {
  const controller = new AbortController();
  const startTime = performance.now();
  let totalBytes = 0;

  // Set a timeout to abort after the target duration
  const timeout = setTimeout(() => {
    controller.abort();
  }, durationSeconds * 1000);

  try {
    const response = await fetch(
      `${API_BASE}/api/download?duration=${durationSeconds}&t=${Date.now()}`,
      {
        signal: controller.signal,
        cache: "no-store",
      }
    );

    if (!response.ok || !response.body) {
      throw new Error("Download test failed to start");
    }

    const reader = response.body.getReader();
    let lastUpdate = startTime;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;
      const now = performance.now();

      // Update progress every 200ms to avoid excessive re-renders
      if (now - lastUpdate >= 200) {
        const elapsed = (now - startTime) / 1000;
        const mbps = (totalBytes * 8) / elapsed / 1_000_000;
        onProgress?.(Math.round(mbps * 100) / 100);
        lastUpdate = now;
      }
    }
  } catch (err: unknown) {
    // AbortError is expected when our timeout fires
    if (err instanceof DOMException && err.name === "AbortError") {
      // Normal termination
    } else {
      throw err;
    }
  } finally {
    clearTimeout(timeout);
  }

  const elapsed = (performance.now() - startTime) / 1000;
  if (elapsed === 0 || totalBytes === 0) return 0;

  return Math.round(((totalBytes * 8) / elapsed / 1_000_000) * 100) / 100;
}

// ─── Upload Test ────────────────────────────────────────────────────────────────

/**
 * Runs an upload speed test by sending binary data to the backend in chunks.
 * Reports live Mbps via the onProgress callback.
 * Returns the final measured upload speed in Mbps.
 */
export async function runUploadTest(
  durationSeconds: number = 8,
  onProgress?: (mbps: number) => void
): Promise<number> {
  const chunkSize = 64 * 1024; // 64KB per chunk (max for getRandomValues)
  const startTime = performance.now();
  let totalBytesSent = 0;
  const endTime = startTime + durationSeconds * 1000;

  // Pre-generate a chunk of random data
  const chunk = new Uint8Array(chunkSize);
  crypto.getRandomValues(chunk);

  // Build a larger payload (1MB per request) by repeating the 64KB chunk
  const payloadSize = 1024 * 1024; // 1MB
  const payload = new Uint8Array(payloadSize);
  for (let i = 0; i < payloadSize / chunkSize; i++) {
    payload.set(chunk, i * chunkSize);
  }

  while (performance.now() < endTime) {

    try {
      const resp = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!resp.ok) {
        throw new Error("Upload request failed");
      }

      totalBytesSent += payload.byteLength;

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const mbps = (totalBytesSent * 8) / elapsed / 1_000_000;
      onProgress?.(Math.round(mbps * 100) / 100);
    } catch {
      // If a single chunk fails, continue with next unless time is up
      if (performance.now() >= endTime) break;
      await sleep(100);
    }
  }

  const elapsed = (performance.now() - startTime) / 1000;
  if (elapsed === 0 || totalBytesSent === 0) return 0;

  return (
    Math.round(((totalBytesSent * 8) / elapsed / 1_000_000) * 100) / 100
  );
}

// ─── Quality Score ──────────────────────────────────────────────────────────────

/**
 * Calculates a connection quality score from 0-100 based on measured metrics.
 */
export function calculateQualityScore(
  downloadMbps: number,
  uploadMbps: number,
  pingMs: number,
  jitterMs: number
): number {
  let score = 0;

  // Download score (max 35)
  if (downloadMbps >= 100) score += 35;
  else if (downloadMbps >= 50) score += 28;
  else if (downloadMbps >= 25) score += 20;
  else if (downloadMbps >= 10) score += 12;
  else score += 5;

  // Upload score (max 25)
  if (uploadMbps >= 30) score += 25;
  else if (uploadMbps >= 15) score += 20;
  else if (uploadMbps >= 5) score += 12;
  else if (uploadMbps >= 1) score += 6;
  else score += 2;

  // Ping score (max 25)
  if (pingMs <= 20) score += 25;
  else if (pingMs <= 50) score += 20;
  else if (pingMs <= 100) score += 12;
  else if (pingMs <= 150) score += 6;
  else score += 2;

  // Jitter score (max 15)
  if (jitterMs <= 5) score += 15;
  else if (jitterMs <= 15) score += 10;
  else if (jitterMs <= 30) score += 6;
  else score += 2;

  return Math.min(100, Math.max(0, score));
}

// ─── Rating & Interpretation ────────────────────────────────────────────────────

/** Returns a connection rating based on the quality score. */
export function getConnectionRating(score: number): ConnectionRating {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

/** Returns a human-readable interpretation based on the rating. */
export function getConnectionInterpretation(rating: ConnectionRating): string {
  switch (rating) {
    case "Excellent":
      return "Excellent connection for streaming, gaming, video calls, remote work, and large downloads.";
    case "Good":
      return "Good connection for daily browsing, HD streaming, video calls, and most online activities.";
    case "Fair":
      return "Fair connection. Usable for browsing and streaming, but video calls or gaming may sometimes feel unstable.";
    case "Poor":
      return "Poor connection. You may experience buffering, lag, slow downloads, or unstable video calls.";
  }
}

// ─── Full Test Orchestrator ─────────────────────────────────────────────────────

/**
 * Runs the complete speed test sequence: ping → download → upload → calculate.
 * Reports progress through callbacks at each phase.
 */
export async function runFullSpeedTest(
  callbacks: TestCallbacks
): Promise<void> {
  try {
    // Phase 1: Ping test
    callbacks.onPhaseChange("testing_ping");
    const pingSamples = await runPingTest(10, callbacks.onPingProgress);

    const avgPing =
      Math.round(
        (pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length) * 100
      ) / 100;
    const jitter = calculateJitter(pingSamples);

    // Phase 2: Download test
    callbacks.onPhaseChange("testing_download");
    const downloadMbps = await runDownloadTest(8, callbacks.onDownloadProgress);

    // Phase 3: Upload test
    callbacks.onPhaseChange("testing_upload");
    const uploadMbps = await runUploadTest(8, callbacks.onUploadProgress);

    // Phase 4: Calculate results
    callbacks.onPhaseChange("calculating");
    await sleep(500); // Brief pause for visual effect

    const qualityScore = calculateQualityScore(
      downloadMbps,
      uploadMbps,
      avgPing,
      jitter
    );
    const rating = getConnectionRating(qualityScore);
    const interpretation = getConnectionInterpretation(rating);

    const result: SpeedTestResult = {
      downloadMbps,
      uploadMbps,
      pingMs: avgPing,
      jitterMs: jitter,
      qualityScore,
      rating,
      interpretation,
    };

    callbacks.onPhaseChange("completed");
    callbacks.onComplete(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Speed test could not be completed. Please try again.";
    callbacks.onPhaseChange("error");
    callbacks.onError(message);
  }
}

// ─── Utility ────────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
