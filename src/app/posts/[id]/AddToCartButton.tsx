"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCartButton({ post }: { post: any }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.some((item) => item._id === post._id);

  const handleAdd = () => {
    addToCart({
      _id: post._id,
      title: post.title,
      price: post.price,
      image: post.titleImage || (post.galleryImages && post.galleryImages[0]) || "/placeholder.jpg",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition relative ${inCart ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={handleAdd}
      disabled={inCart}
    >
      {inCart ? "Added" : added ? "Added!" : "Add to Cart"}
    </button>
  );
}
