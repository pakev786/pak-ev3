"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import styles from './HeroSlider.module.css';

const transitions = [
  'fade',
  'slideLeft',
  'slideRight',
  'flip',
  'box',
  'pieces',
];

const images = [
  "/Pics/slider1.jpg",
  "/Pics/slider2.jpg",
  "/Pics/slider3.jpg",
  "/Pics/slider4.jpg",
  "/Pics/slider5.jpg",
  "/Pics/slider6.jpg",
  "/Pics/slider7.jpg",
  "/Pics/slider8.jpg",
  "/Pics/slider9.jpg",
  "/Pics/slider10.jpg",
  "/Pics/slider11.jpg",
  "/Pics/slider12.jpg",
  "/Pics/slider13.jpg",
  "/Pics/slider14.jpg",
  "/Pics/slider15.jpg",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(transitions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransition(transitions[Math.floor(Math.random() * transitions.length)]);
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500); // ہر 3.5 سیکنڈ بعد تصویر بدلے
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[220px] md:h-[400px] overflow-hidden rounded-xl shadow-lg">
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`Slider Image ${idx + 1}`}
          fill
          style={{ objectFit: "cover" }}
          priority={idx === 0}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out 
            ${idx === current ? `${styles[transition]} z-10 opacity-100` : 'opacity-0 z-0'}`}
        />
      ))}
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full border border-white bg-white/80 transition-all duration-300 ${idx === current ? "bg-green-500 scale-125" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
