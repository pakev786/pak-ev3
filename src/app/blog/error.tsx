'use client';
import LoaderEV from "@/components/LoaderEV";

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>کچھ غلط ہو گیا! (Blog)</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>دوبارہ کوشش کریں</button>
    </div>
  );
}
