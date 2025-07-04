import React from "react";

export default function WhatsappChatButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/923020029229"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-colors duration-200 animate-bounce"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="#fff"
        >
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.393.713 4.676 2.06 6.668L4 29l7.583-2.008C13.308 27.649 14.639 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.223 0-2.425-.202-3.57-.6l-.255-.086-4.52 1.196 1.207-4.404-.167-.256C7.206 18.431 7 16.728 7 15c0-5.037 4.063-9.125 9-9.125S25 9.963 25 15c0 5.037-4.063 9.125-9 9.125zm5.25-6.104c-.287-.144-1.7-.84-1.962-.936-.263-.096-.454-.144-.646.144-.192.287-.74.936-.907 1.128-.167.192-.335.216-.622.072-.287-.144-1.212-.446-2.31-1.42-.854-.76-1.43-1.7-1.598-1.987-.167-.287-.018-.442.126-.586.13-.13.287-.335.431-.502.144-.167.192-.287.288-.478.096-.192.048-.36-.024-.504-.072-.144-.646-1.56-.885-2.136-.233-.561-.47-.484-.646-.493-.167-.007-.36-.009-.552-.009s-.504.072-.768.36c-.263.287-1 1.004-1 2.446 0 1.442 1.025 2.838 1.168 3.034.144.192 2.019 3.088 5.01 4.208.701.241 1.247.384 1.674.491.703.179 1.343.154 1.848.094.563-.066 1.7-.694 1.94-1.362.24-.668.24-1.24.168-1.362-.072-.12-.263-.192-.55-.336z" />
        </svg>
        <span className="text-white font-bold text-lg outline-none bg-transparent">Chat with us</span>
      </a>
    </div>
  );
}
