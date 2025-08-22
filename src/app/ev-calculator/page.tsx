'use client'

import React from 'react'

export default function EVCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-primary/10 py-0">
        <div className="container mx-auto px-4 my-0">
          {/* اوپر اور نیچے بالکل کم سے کم اسپیس، لائن ہائٹ بھی کم */}
          <p className="text-xl text-gray-600 m-0 p-0 leading-tight" style={{paddingTop: '2px', paddingBottom: '2px'}}>
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
