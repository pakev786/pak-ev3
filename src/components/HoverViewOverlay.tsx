"use client";
import { ReactNode } from "react";
import { motion, easeInOut } from "framer-motion";

interface HoverViewOverlayProps {
  onClick?: () => void;
  children: ReactNode;
  isHovered?: boolean;
}

export default function HoverViewOverlay({ onClick, children, isHovered }: HoverViewOverlayProps) {
  // If isHovered is provided, control animation via prop. Otherwise fallback to group-hover/whileHover
  const overlayMotionProps = isHovered === undefined
    ? {
        initial: { opacity: 0 },
        whileHover: { opacity: 1 },
        transition: { duration: 0.3, ease: easeInOut }
      }
    : {
        initial: { opacity: 0 },
        animate: isHovered ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.3, ease: easeInOut }
      };

  const iconMotionProps = isHovered === undefined
    ? {
        initial: { opacity: 0, y: -80 },
        whileHover: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -80 },
        transition: { duration: 0.4, ease: easeInOut }
      }
    : {
        initial: { opacity: 0, y: -80 },
        animate: isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -80 },
        exit: { opacity: 0, y: -80 },
        transition: { duration: 0.4, ease: easeInOut }
      };



  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      {children}
      {/* Hover Overlay */}
      <motion.div
        {...overlayMotionProps}
        className="absolute inset-0 h-full w-full flex items-center justify-center bg-transparent group-hover:bg-white/30 opacity-0 group-hover:opacity-100 z-20 transition-all duration-300"
        style={{ pointerEvents: "none" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          whileHover={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="flex items-center justify-center rounded-full bg-white/90 shadow-lg w-16 h-16"
          style={{ pointerEvents: "auto" }}
        >
          {/* Magnifier Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
