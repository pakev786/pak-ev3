import React from 'react';

// A beautiful animated loader using Tailwind and SVG
const Loader: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
    <svg
      className="animate-spin text-primary"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-20"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="8"
      />
      <path
        d="M45 25c0-11.046-8.954-20-20-20"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="opacity-80"
      />
    </svg>
  </div>
);

export default Loader;
