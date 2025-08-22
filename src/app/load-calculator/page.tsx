'use client'

import React from 'react'

export default function LoadCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-primary/10 py-2">
        <div className="container mx-auto px-2">
          {/* اوپر والا ٹائٹل (Pak EV Load Calculator) ہٹا دیا گیا */}
        </div>
      </div>
      <section className="pt-1 pb-4">
        <div className="w-full max-w-full mx-auto">
          <iframe 
            src="/calculators/mobile.html" 
            className="w-full h-[2400px] border-0 bg-white"
            title="Load Calculator"
            scrolling="no"
            style={{ display: 'block', margin: 0, padding: 0 }}
          />
        </div>
      </section>
    </main>
  )
}
