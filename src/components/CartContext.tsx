"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  _id: string;
  title: string;
  price: string;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (_id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      if (prev.some((i) => i._id === item._id)) return prev;
      return [...prev, item];
    });
  };
  const removeFromCart = (_id: string) => {
    setCart((prev) => prev.filter((i) => i._id !== _id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
