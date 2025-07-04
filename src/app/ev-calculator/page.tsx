'use client'

import React from 'react'

export default function EVCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-primary/10 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">EV Calculator</h1>
          <p className="text-xl text-gray-600">
            Calculate the cost of converting your bike to electric
          </p>
        </div>
      </div>
      
      <section className="pt-2 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white rounded-lg">
                <iframe 
                  src="/calculators/calculator.html" 
                  className="w-full h-[800px] border-0"
                  title="EV Calculator"
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
