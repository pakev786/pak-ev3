"use client";
import React from "react";

export default function DebugPostsClient() {
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleDebugClick = () => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(d => {
        setResult(d);
        setError(null);
        console.log('CLIENT: /api/posts response:', d);
      })
      .catch(e => {
        setError(e.message || 'Error');
        setResult(null);
        console.log('CLIENT: /api/posts error:', e);
      });
  };

  return (
    <div className="bg-blue-100 border border-blue-400 rounded p-2 mb-2 text-xs text-right font-mono">
      <button onClick={handleDebugClick} className="bg-blue-600 text-white px-3 py-1 rounded mb-2">کلائنٹ سائیڈ API ڈیباگ</button>
      {result && <div><b>API Result:</b> <pre dir="ltr">{JSON.stringify(result, null, 2)}</pre></div>}
      {error && <div className="text-red-600">Error: {error}</div>}
    </div>
  );
}
