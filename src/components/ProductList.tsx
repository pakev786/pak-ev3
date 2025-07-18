'use client'

import React from 'react'
import Image from 'next/image'
import LoaderEV from "@/components/LoaderEV";

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

type ProductListProps = {
  category: string
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  // This would typically come from your API or database
  const products = [
    {
      id: '1',
      name: 'EV Charging Station',
      description: 'Fast charging station for all EV types',
      price: 150000,
      image: '/products/charging-station.jpg',
      category: 'EV Parts'
    },
    {
      id: '2',
      name: 'TriRide Deluxe',
      description: 'Premium electric tricycle for commercial use',
      price: 250000,
      image: '/products/triride.jpg',
      category: 'Pak TriRide'
    },
    {
      id: '3',
      name: 'Solar Battery Pack',
      description: 'High-capacity solar battery storage',
      price: 75000,
      image: '/products/solar-battery.jpg',
      category: 'Solar Batteries'
    }
  ]
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{category}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96">
                {/*
                  اس Image کو مکمل optimize کیا گیا ہے:
                  - sizes attribute responsive loading کے لیے
                  - lazy loading (default)
                {/*
                  اس Image کو مکمل optimize کیا گیا ہے:
                  - sizes attribute responsive loading کے لیے
                  - lazy loading (default)
                  - alt text SEO کے لیے
                */}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
          </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold">{product.price}</span>
                  <button
                    onClick={() => window.location.href = `/products/${product.id}`}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    <LoaderEV size={64} /> View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductList
