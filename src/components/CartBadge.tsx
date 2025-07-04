"use client";
import React from "react";
import { useCart } from "./CartContext";

export default function CartBadge() {
  const { cart } = useCart();
  if (!cart.length) return null;
  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
      {cart.length}
    </span>
  );
}
