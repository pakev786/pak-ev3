"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("query") || "" : "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError("");
    fetch(`/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const q = query.trim().toLowerCase();
          const filtered = data.data.filter(
            (post: any) =>
              post.title?.toLowerCase().includes(q) ||
              post.description?.toLowerCase().includes(q) ||
              post.category?.toLowerCase().includes(q)
          );
          setResults(filtered);
        } else {
          setError("No results found");
        }
      })
      .catch(() => setError("Error fetching results"))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <div className="mb-4 text-gray-600 text-sm">Query: <b>{query}</b></div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {!loading && !error && results.length === 0 && (
        <div>No results found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((post) => (
          <Link
            href={`/posts/${post._id || post.id}`}
            key={post._id || post.id}
            className="block border rounded-lg p-4 hover:shadow-lg transition bg-white"
          >
            <div className="font-bold text-lg mb-1">{post.title}</div>
            <div className="text-gray-500 text-sm mb-2">{post.category}</div>
            <div className="mb-2 line-clamp-2">{post.description}</div>
            {post.titleImage && (
              <img src={post.titleImage} alt={post.title} className="w-full h-40 object-cover rounded" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
