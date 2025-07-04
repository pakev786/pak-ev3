'use client'

import React from 'react'

export default function LoadCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-primary/10 py-2">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Load Calculator</h1>
          <p className="text-xl text-gray-600">
            Calculate your electrical load requirements and get battery recommendations
          </p>
        </div>
      </div>
      
      <section className="pt-0 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white rounded-lg">
                <iframe 
                  src="/calculators/mobile.html" 
                  className="w-full h-[2400px] border-0"
                  title="Load Calculator"
                  scrolling="no"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
