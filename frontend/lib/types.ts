/** Represents the current phase of the speed test state machine. */
export type TestPhase =
  | "idle"
  | "testing_ping"
  | "testing_download"
  | "testing_upload"
  | "calculating"
  | "completed"
  | "error";

/** Final results after a complete speed test. */
export type SpeedTestResult = {
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  qualityScore: number;
  rating: ConnectionRating;
  interpretation: string;
};

/** Connection quality rating categories. */
export type ConnectionRating = "Excellent" | "Good" | "Fair" | "Poor";

/** Callbacks for live progress updates during the test. */
export type TestCallbacks = {
  onPhaseChange: (phase: TestPhase) => void;
  onPingProgress: (pingMs: number) => void;
  onDownloadProgress: (mbps: number) => void;
  onUploadProgress: (mbps: number) => void;
  onComplete: (result: SpeedTestResult) => void;
  onError: (message: string) => void;
};
