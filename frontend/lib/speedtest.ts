import type {
  SpeedTestResult,
  ConnectionRating,
  TestCallbacks,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ─── Ping Test ──────────────────────────────────────────────────────────────────

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

    if (i > 0) {
      samples.push(Math.round(rtt * 100) / 100);
      onProgress?.(Math.round(rtt * 100) / 100);
    }

    await sleep(100);
  }

  return samples;
}

export function calculateJitter(samples: number[]): number {
  if (samples.length < 2) return 0;

  let totalDiff = 0;
  for (let i = 1; i < samples.length; i++) {
    totalDiff += Math.abs(samples[i] - samples[i - 1]);
  }

  return Math.round((totalDiff / (samples.length - 1)) * 100) / 100;
}

// ─── Multi-Stream Download Test ────────────────────────────────────────────────

export async function runDownloadTest(
  durationSeconds: number = 8,
  onProgress?: (mbps: number) => void
): Promise<number> {
  const streamsCount = 4; // LibreSpeed default concurrent streams
  const startTime = performance.now();
  let totalBytes = 0;
  const endTime = startTime + durationSeconds * 1000;
  let running = true;

  const runStream = async (streamId: number) => {
    while (running && performance.now() < endTime) {
      const controller = new AbortController();
      // Ensure we abort if we run out of time
      const timeRemaining = endTime - performance.now();
      const timeout = setTimeout(() => controller.abort(), timeRemaining + 1000);

      try {
        const response = await fetch(
          `${API_BASE}/api/download?duration=${durationSeconds}&t=${Date.now()}&s=${streamId}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok || !response.body) break;

        const reader = response.body.getReader();
        while (running) {
          const { done, value } = await reader.read();
          if (done) break;

          totalBytes += value.byteLength;

          if (performance.now() >= endTime) {
            running = false;
            controller.abort();
            break;
          }
        }
      } catch (err) {
        // Network errors or AbortErrors are caught and ignored so the loop can retry if time remains
      } finally {
        clearTimeout(timeout);
      }
    }
  };

  const promises = [];
  for (let i = 0; i < streamsCount; i++) {
    promises.push(runStream(i));
  }

  // Progress reporter
  const progressInterval = setInterval(() => {
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    if (elapsed > 0.1) {
      const mbps = (totalBytes * 8) / elapsed / 1_000_000;
      onProgress?.(Math.round(mbps * 100) / 100);
    }
    if (now >= endTime) {
      clearInterval(progressInterval);
      running = false;
    }
  }, 200);

  await Promise.all(promises);
  clearInterval(progressInterval);
  running = false;

  const elapsed = (performance.now() - startTime) / 1000;
  if (elapsed <= 0 || totalBytes === 0) return 0;
  return Math.round(((totalBytes * 8) / elapsed / 1_000_000) * 100) / 100;
}

// ─── Multi-Stream Upload Test ──────────────────────────────────────────────────

export async function runUploadTest(
  durationSeconds: number = 8,
  onProgress?: (mbps: number) => void
): Promise<number> {
  const streamsCount = 4;
  const chunkSize = 64 * 1024;
  const startTime = performance.now();
  let totalBytesSent = 0;
  const endTime = startTime + durationSeconds * 1000;
  let running = true;

  const chunk = new Uint8Array(chunkSize);
  crypto.getRandomValues(chunk);

  const payloadSize = 1024 * 1024; // 1MB payload
  const payload = new Uint8Array(payloadSize);
  for (let i = 0; i < payloadSize / chunkSize; i++) {
    payload.set(chunk, i * chunkSize);
  }

  const runStream = async () => {
    while (running && performance.now() < endTime) {
      try {
        const resp = await fetch(`${API_BASE}/api/upload`, {
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
        if (resp.ok) {
          totalBytesSent += payload.byteLength;
        }
      } catch {
        if (performance.now() >= endTime) break;
        await sleep(50);
      }
    }
  };

  const promises = [];
  for (let i = 0; i < streamsCount; i++) {
    promises.push(runStream());
  }

  const progressInterval = setInterval(() => {
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    if (elapsed > 0.1) {
      const mbps = (totalBytesSent * 8) / elapsed / 1_000_000;
      onProgress?.(Math.round(mbps * 100) / 100);
    }
    if (now >= endTime) {
      clearInterval(progressInterval);
      running = false;
    }
  }, 200);

  await Promise.all(promises);
  clearInterval(progressInterval);
  running = false;

  const elapsed = (performance.now() - startTime) / 1000;
  if (elapsed <= 0 || totalBytesSent === 0) return 0;
  return Math.round(((totalBytesSent * 8) / elapsed / 1_000_000) * 100) / 100;
}

// ─── Quality Score & Full Test Orchestrator ─────────────────────────────────────

export function calculateQualityScore(
  downloadMbps: number,
  uploadMbps: number,
  pingMs: number,
  jitterMs: number
): number {
  let score = 0;
  if (downloadMbps >= 100) score += 35;
  else if (downloadMbps >= 50) score += 28;
  else if (downloadMbps >= 25) score += 20;
  else if (downloadMbps >= 10) score += 12;
  else score += 5;

  if (uploadMbps >= 30) score += 25;
  else if (uploadMbps >= 15) score += 20;
  else if (uploadMbps >= 5) score += 12;
  else if (uploadMbps >= 1) score += 6;
  else score += 2;

  if (pingMs <= 20) score += 25;
  else if (pingMs <= 50) score += 20;
  else if (pingMs <= 100) score += 12;
  else if (pingMs <= 150) score += 6;
  else score += 2;

  if (jitterMs <= 5) score += 15;
  else if (jitterMs <= 15) score += 10;
  else if (jitterMs <= 30) score += 6;
  else score += 2;

  return Math.min(100, Math.max(0, score));
}

export function getConnectionRating(score: number): ConnectionRating {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

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

export async function saveTelemetry(result: SpeedTestResult): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/telemetry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        download: result.downloadMbps,
        upload: result.uploadMbps,
        ping: result.pingMs,
        jitter: result.jitterMs,
        quality: result.qualityScore,
        isp_info: "SpeedCheck.DEV Frontend"
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.id;
    }
  } catch {
    // Ignore telemetry errors
  }
  return null;
}

export async function runFullSpeedTest(
  callbacks: TestCallbacks & { onTelemetryId?: (id: string) => void }
): Promise<void> {
  try {
    callbacks.onPhaseChange("testing_ping");
    const pingSamples = await runPingTest(10, callbacks.onPingProgress);

    const avgPing = Math.round((pingSamples.reduce((a, b) => a + b, 0) / pingSamples.length) * 100) / 100;
    const jitter = calculateJitter(pingSamples);

    callbacks.onPhaseChange("testing_download");
    const downloadMbps = await runDownloadTest(8, callbacks.onDownloadProgress);

    callbacks.onPhaseChange("testing_upload");
    const uploadMbps = await runUploadTest(8, callbacks.onUploadProgress);

    callbacks.onPhaseChange("calculating");
    await sleep(500);

    const qualityScore = calculateQualityScore(downloadMbps, uploadMbps, avgPing, jitter);
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

    // Save telemetry and return ID
    const telemetryId = await saveTelemetry(result);
    if (telemetryId && callbacks.onTelemetryId) {
      callbacks.onTelemetryId(telemetryId);
    }

    callbacks.onPhaseChange("completed");
    callbacks.onComplete(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Speed test could not be completed. Please try again.";
    callbacks.onPhaseChange("error");
    callbacks.onError(message);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
