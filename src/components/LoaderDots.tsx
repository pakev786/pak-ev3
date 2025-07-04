import React from "react";

const LoaderDots: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`} style={{ height: size * 2 }} role="status" aria-label="Loading">
    <span className="block rounded-full bg-primary animate-bounce" style={{ width: size, height: size, animationDelay: "0ms" }}></span>
    <span className="block rounded-full bg-primary/70 animate-bounce" style={{ width: size, height: size, animationDelay: "150ms" }}></span>
    <span className="block rounded-full bg-primary/40 animate-bounce" style={{ width: size, height: size, animationDelay: "300ms" }}></span>
  </div>
);

export default LoaderDots;
