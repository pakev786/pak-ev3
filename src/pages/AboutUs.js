import React from 'react';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Image/Section */}
          <div className="bg-black text-white p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Pak EV</h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Powering Pakistan's electric future, one conversion at a time.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            
            {/* Origin Story */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm">01</span>
                Our Roots
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Pak EV is a proud Pakistani startup co-founded by <strong className="text-gray-900">Haroon Umar</strong>. 
                Our journey began in <span className="text-gray-900 font-medium">Head Rajkan (Bahawalpur)</span> with a vision to revolutionize transportation in Pakistan. 
                From humble beginnings, we have expanded our footprint to more than <strong className="text-gray-900">20 cities</strong> across the nation, serving thousands of satisfied customers.
              </p>
            </section>

            {/* What We Do */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">02</span>
                What We Do
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                We are a comprehensive brand dedicated to sustainable energy and electric mobility. Our core expertise includes:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-3xl mb-3">🏍️</div>
                  <h3 className="font-bold text-gray-900 mb-2">EV Conversions</h3>
                  <p className="text-sm text-gray-500">Complete engine-to-EV conversion services for bikes and cars, breathing new electric life into your existing vehicles.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-3xl mb-3">⚙️</div>
                  <h3 className="font-bold text-gray-900 mb-2">EV Parts</h3>
                  <p className="text-sm text-gray-500">A vast inventory of high-quality spare parts for electric bikes and cars to keep you moving.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-3xl mb-3">☀️</div>
                  <h3 className="font-bold text-gray-900 mb-2">Solar Systems</h3>
                  <p className="text-sm text-gray-500">Professional installation of solar energy systems for homes and businesses.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="text-3xl mb-3">🔌</div>
                  <h3 className="font-bold text-gray-900 mb-2">Solar Parts</h3>
                  <p className="text-sm text-gray-500">Authentic solar panels, inverters, and accessories for all your energy needs.</p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer / Credits */}
          <div className="bg-gray-900 text-gray-400 p-8 text-center text-sm border-t border-gray-800">
            <p className="mb-4">
              © {new Date().getFullYear()} Pak EV. All rights reserved.
            </p>
            <div className="pt-4 border-t border-gray-800">
              <p>
                This website is built in collaboration with{' '}
                <a 
                  href="https://www.linkedin.com/in/vertex-soft-173a7b3a1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 font-bold transition"
                >
                  Vertex Soft
                </a>
              </p>
              <p className="mt-1 text-xs opacity-60">
                All website contents and digital assets are reserved for Vertex Soft Solutions.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}