import React from "react";

const LoaderDualRing: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
    <svg width={size} height={size} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" stroke="#3b82f6" strokeWidth="4" opacity="0.3" />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        strokeDasharray="31.4 31.4"
        strokeLinecap="round"
        className="animate-spin-slow"
      />
    </svg>
    <style jsx>{`
      .animate-spin-slow {
        animation: spin 1.2s linear infinite;
      }
      @keyframes spin {
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoaderDualRing;
