import React from "react";

// EV theme: Bolt spinner
const LoaderEV: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <g className="animate-spin-super">
        <polygon points="32,8 40,32 32,32 36,56 24,32 32,32 28,8" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
      </g>
    </svg>
    <style jsx>{`
      .animate-spin-super {
        animation: spin 1s cubic-bezier(.4,2,.6,1) infinite;
        transform-origin: 32px 32px;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoaderEV;
