import React from 'react';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  const socialLinks = [
    { name: 'WhatsApp Channel', url: 'https://www.whatsapp.com/channel/0029VbBftVK1dAw10Y04Nv1E', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z', color: 'text-green-500 hover:text-green-600' },
    { name: 'Instagram', url: 'https://www.instagram.com/pakev_official', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', color: 'text-pink-600 hover:text-pink-700' },
    { name: 'YouTube', url: 'http://www.youtube.com/@PAKEVOfficial', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z', color: 'text-red-600 hover:text-red-700' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@pak.ev8', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.35-1.17 1.09-1.07 1.93.03.58.01 1.16.44 1.54.48.42 1.3.31 1.8.02.57-.33 1.01-.9 1.09-1.51.13-1.04.09-2.09.09-3.13.01-4.31-.02-8.62.01-12.93.04.03.09.06.13.09h-.16z', color: 'text-black hover:text-gray-800' },
    { name: 'Facebook', url: 'https://www.facebook.com/share/1H1t8S5GW6/', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: 'text-blue-600 hover:text-blue-700' }
  ];

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
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                  <div className="text-3xl mb-3">🏍️</div>
                  <h3 className="font-bold text-gray-900 mb-2">EV Conversions</h3>
                  <p className="text-sm text-gray-500">Complete engine-to-EV conversion services for bikes and cars, breathing new electric life into your existing vehicles.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                  <div className="text-3xl mb-3">⚙️</div>
                  <h3 className="font-bold text-gray-900 mb-2">EV Parts</h3>
                  <p className="text-sm text-gray-500">A vast inventory of high-quality spare parts for electric bikes and cars to keep you moving.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                  <div className="text-3xl mb-3">☀️</div>
                  <h3 className="font-bold text-gray-900 mb-2">Solar Systems</h3>
                  <p className="text-sm text-gray-500">Professional installation of solar energy systems for homes and businesses.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                  <div className="text-3xl mb-3">🔌</div>
                  <h3 className="font-bold text-gray-900 mb-2">Solar Parts</h3>
                  <p className="text-sm text-gray-500">Authentic solar panels, inverters, and accessories for all your energy needs.</p>
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">03</span>
                Connect With Us
              </h2>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:shadow-md transition group ${link.color}`}
                  >
                    <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d={link.icon} />
                    </svg>
                    <span className="font-semibold text-gray-700 group-hover:text-black">{link.name}</span>
                  </a>
                ))}
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
                  href="https://www.linkedin.com/company/vertex-soft-solutions/" 
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