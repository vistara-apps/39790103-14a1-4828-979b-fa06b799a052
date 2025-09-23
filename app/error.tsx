'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-white rounded-lg p-6 shadow-modal">
          <h2 className="text-2xl font-bold text-text mb-4">
            Something went wrong!
          </h2>
          <p className="text-secondary-text mb-6">
            We encountered an error while loading HealthConnect. Please try again.
          </p>
          <button
            onClick={reset}
            className="btn-primary w-full"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
