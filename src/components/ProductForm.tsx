"use client";
import React, { useState, useEffect } from "react";

interface ProductFormProps {
  initialData?: any; // Pass post data for edit, or leave undefined for create
  onSuccess?: () => void;
}

const categories = [
  "ev-parts",
  "ev-kits",
  "triride",
  "ev-batteries",
  "solar-batteries",
  "solar-parts",
];

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || categories[0]);
  const [description, setDescription] = useState(initialData?.description || "");
  const [titleImage, setTitleImage] = useState(initialData?.titleImage || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData?._id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        title,
        price,
        category,
        description,
        titleImage,
      };
      const url = isEdit
        ? `/api/posts/${initialData._id}`
        : "/api/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");
      if (onSuccess) onSuccess();
      alert("Post saved successfully!");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Post" : "Create New Post"}
      </h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Price</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Category</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option value={cat} key={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Image URL</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={titleImage}
          onChange={(e) => setTitleImage(e.target.value)}
          placeholder="https://..."
        />
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
        disabled={loading}
      >
        {loading ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
};

export default ProductForm;
