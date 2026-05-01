interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="glass-card border-[rgba(239,68,68,0.3)] p-6 flex flex-col items-center gap-4 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(239,68,68,0.15)]">
        <svg className="h-6 w-6 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-[#F8FAFC]">Test Failed</p>
        <p className="mt-1 text-sm text-[#94A3B8]">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-lg bg-[rgba(239,68,68,0.15)] px-5 py-2 text-sm font-medium text-[#EF4444] border border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.25)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
      >
        Try Again
      </button>
    </div>
  );
}
