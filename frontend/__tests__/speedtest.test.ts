import {
  calculateJitter,
  calculateQualityScore,
  getConnectionRating,
  getConnectionInterpretation,
} from "../lib/speedtest";

// ─── Jitter Tests ──────────────────────────────────────────────────────────────

describe("calculateJitter", () => {
  it("returns 0 for a single sample", () => {
    expect(calculateJitter([20])).toBe(0);
  });

  it("returns 0 for empty array", () => {
    expect(calculateJitter([])).toBe(0);
  });

  it("calculates jitter correctly from spec example", () => {
    // |24-20|=4, |22-24|=2, |28-22|=6 → avg = 4
    expect(calculateJitter([20, 24, 22, 28])).toBe(4);
  });

  it("returns 0 for perfectly stable ping", () => {
    expect(calculateJitter([20, 20, 20, 20])).toBe(0);
  });

  it("handles two samples", () => {
    expect(calculateJitter([10, 20])).toBe(10);
  });
});

// ─── Quality Score Tests ───────────────────────────────────────────────────────

describe("calculateQualityScore", () => {
  it("returns 100 for perfect connection", () => {
    // 100Mbps down=35, 30Mbps up=25, 10ms ping=25, 3ms jitter=15 → 100
    expect(calculateQualityScore(100, 30, 10, 3)).toBe(100);
  });

  it("returns minimum score for very poor connection", () => {
    // <10 down=5, <1 up=2, >150 ping=2, >30 jitter=2 → 11
    expect(calculateQualityScore(1, 0.5, 200, 50)).toBe(11);
  });

  it("is capped at 100", () => {
    expect(calculateQualityScore(200, 100, 1, 0)).toBe(100);
  });

  it("is capped at 0 minimum", () => {
    expect(calculateQualityScore(0, 0, 0, 0)).toBeGreaterThanOrEqual(0);
  });

  it("scores 50-99 Mbps download as 28 points", () => {
    const score = calculateQualityScore(75, 30, 10, 3);
    // 28 + 25 + 25 + 15 = 93
    expect(score).toBe(93);
  });

  it("scores 25-49 Mbps download as 20 points", () => {
    const score = calculateQualityScore(30, 30, 10, 3);
    // 20 + 25 + 25 + 15 = 85
    expect(score).toBe(85);
  });

  it("scores high ping (>150ms) as 2 points", () => {
    const score = calculateQualityScore(100, 30, 200, 3);
    // 35 + 25 + 2 + 15 = 77
    expect(score).toBe(77);
  });

  it("scores high jitter (>30ms) as 2 points", () => {
    const score = calculateQualityScore(100, 30, 10, 35);
    // 35 + 25 + 25 + 2 = 87
    expect(score).toBe(87);
  });
});

// ─── Rating Tests ──────────────────────────────────────────────────────────────

describe("getConnectionRating", () => {
  it("returns Excellent for score >= 90", () => {
    expect(getConnectionRating(90)).toBe("Excellent");
    expect(getConnectionRating(100)).toBe("Excellent");
  });

  it("returns Good for score 75-89", () => {
    expect(getConnectionRating(75)).toBe("Good");
    expect(getConnectionRating(89)).toBe("Good");
  });

  it("returns Fair for score 50-74", () => {
    expect(getConnectionRating(50)).toBe("Fair");
    expect(getConnectionRating(74)).toBe("Fair");
  });

  it("returns Poor for score below 50", () => {
    expect(getConnectionRating(49)).toBe("Poor");
    expect(getConnectionRating(0)).toBe("Poor");
  });
});

// ─── Interpretation Tests ──────────────────────────────────────────────────────

describe("getConnectionInterpretation", () => {
  it("returns correct text for Excellent", () => {
    const text = getConnectionInterpretation("Excellent");
    expect(text).toContain("streaming");
    expect(text).toContain("gaming");
  });

  it("returns correct text for Good", () => {
    const text = getConnectionInterpretation("Good");
    expect(text).toContain("browsing");
  });

  it("returns correct text for Fair", () => {
    const text = getConnectionInterpretation("Fair");
    expect(text).toContain("unstable");
  });

  it("returns correct text for Poor", () => {
    const text = getConnectionInterpretation("Poor");
    expect(text).toContain("buffering");
  });
});
