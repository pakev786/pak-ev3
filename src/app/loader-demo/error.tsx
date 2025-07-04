'use client';

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">کچھ غلط ہو گیا!</h2>
      <p className="mb-6 text-gray-700">{error.message}</p>
      <button
        onClick={() => reset()}
        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
      >
        دوبارہ کوشش کریں
      </button>
    </div>
  );
}
