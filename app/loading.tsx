export default function Loading() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-white text-xl font-semibold mb-2">HealthConnect</h2>
        <p className="text-white/80">Loading your health advocacy platform...</p>
      </div>
    </div>
  );
}
