// TopAnnouncementSlider.tsx
// اورنج بیک گراؤنڈ پر وائٹ سلائیڈنگ ٹیکسٹ (alladin.pk اسٹائل)
'use client';
import React, { useEffect, useRef, useState } from 'react';

const SLIDES = [
  'Your one-stop destination for all premium Solar and EV components.',
  '24-Hours Order Processing Time and 2 - 5 Working Days Delivery Time',
  'Working Hours Sat-Thu 10:00AM to 08:00PM',
];

export default function TopAnnouncementSlider() {
  const [active, setActive] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // سلائیڈر خودکار اگلے پیغام پر جائے
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 3400);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [active]);

  return (
    <>
      {/* نمایاں اورنج ایناؤنسمنٹ بار: ہمیشہ سب سے اوپر اور fix */}
      <div style={{position:'fixed', top:0, left:0, width:'100vw', zIndex:50}} className="bg-[#FF9100] text-white text-center text-base sm:text-lg font-bold py-3 select-none overflow-hidden shadow">
        <div className="relative h-8 sm:h-10 flex items-center justify-center">
          {SLIDES.map((txt, idx) => (
            <span
              key={idx}
              className={`absolute left-0 right-0 transition-all duration-800 ease-in-out ${
                idx === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
              style={{letterSpacing:'0.01em', fontWeight:'bold', fontSize:'1.08em'}}
            >
              {txt}
            </span>
          ))}
        </div>
      </div>
      {/* ہیڈر کو نیچے دھکیلنے کے لیے اتنی ہی اونچائی کا placeholder */}
      <div className="w-full" style={{height:'44px'}}></div>
    </>
  );
}
