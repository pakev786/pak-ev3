import React from "react";

const LoaderPulse: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
    <span
      className="block rounded-full bg-primary opacity-70 animate-pulse"
      style={{ width: size, height: size }}
    ></span>
  </div>
);

export default LoaderPulse;
