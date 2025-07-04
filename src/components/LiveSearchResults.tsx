import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface PostResult {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  type: 'product' | 'blog';
}

export default function LiveSearchResults({ query, onClose }: { query: string; onClose: () => void }) {
  const [results, setResults] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/posts').then(r => r.json()).catch(() => []),
      fetch('/api/posts?category=blog').then(r => r.json()).catch(() => [])
    ]).then(([products, blogs]) => {
      let productResults: PostResult[] = [];
      let blogResults: PostResult[] = [];
      if (products && products.success && Array.isArray(products.data)) {
        productResults = products.data.filter((p: any) =>
          (p.title && p.title.toLowerCase().includes(query.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
        ).map((p: any) => ({
          _id: p._id?.toString?.() ?? p._id,
          title: p.title,
          description: p.description,
          category: p.category,
          type: 'product'
        }));
      }
      if (blogs && blogs.success && Array.isArray(blogs.data)) {
        blogResults = blogs.data.filter((b: any) =>
          (b.title && b.title.toLowerCase().includes(query.toLowerCase())) ||
          (b.content && b.content.toLowerCase().includes(query.toLowerCase()))
        ).map((b: any) => ({
          id: b.id,
          title: b.title,
          content: b.content,
          category: b.category,
          type: 'blog'
        }));
      }
      setResults([...productResults, ...blogResults]);
    }).catch(() => setError('Failed to search.')).finally(() => setLoading(false));
  }, [query]);

  if (!query || query.length < 2) return null;
  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
      {loading && (
        <div className="p-4 text-center text-gray-500">Searching...</div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}
      {!loading && !error && results.length === 0 && (
        <div className="p-4 text-center text-gray-500">No results found.</div>
      )}
      {!loading && !error && results.length > 0 && (
        <div className="overflow-y-auto max-h-56">
          <ul>
            {results.map((r, i) => (
              <li key={i} className="border-b last:border-b-0">
                <Link
                  href={r.type === 'blog' ? `/blog/${r.id}` : `/posts/${r._id}`}
                  className="block px-4 py-3 hover:bg-primary/10 transition-colors"
                  onClick={onClose}
                >
                  <span className="font-semibold text-gray-800">{r.title}</span>
                  {r.category && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{r.category}</span>
                  )}
                  <div className="text-gray-500 text-sm truncate">
                    {r.description || r.content}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
