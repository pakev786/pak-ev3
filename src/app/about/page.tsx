import React from 'react'
import Image from 'next/image'

import fs from 'fs';
import path from 'path';

async function getContactInfo() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/contact.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { email: 'info@pakev.com', phone: '+92 300 1234567' };
  }
}

export default async function AboutPage() {
  const contact = await getContactInfo();
  return (
    <main className="min-h-screen mt-0 pt-0">
      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* About page title اور bar ہٹا دی گئی */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At Pak EV, we are committed to accelerating Pakistan's transition to sustainable transportation and energy solutions. Our mission is to provide high-quality electric vehicle components, solar solutions, and innovative mobility options that are both environmentally friendly and economically viable.
              </p>
              <p className="text-gray-600">
                We believe in a future where clean energy powers our nation's growth, and we're working tirelessly to make that vision a reality.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us Section (moved from homepage) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className="text-center mb-16"
            style={{ opacity: 1, transform: 'none' }}
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of electric vehicle charging with our advanced technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="transform transition-transform duration-300 hover:scale-105">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  {/* High Efficiency Icon */}
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">High Efficiency</h3>
                <p className="text-gray-600">Experience maximum energy output with our advanced lithium battery – delivering consistent performance and faster charging every time.</p>
              </div>
            </div>
            <div className="group text-center">
              <div className="transform transition-transform duration-300 hover:scale-105">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  {/* Best Services Icon */}
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-3.13V7a4 4 0 00-3-3.87M7 7V7a4 4 0 013-3.87" /></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Best Services</h3>
                <p className="text-gray-600">We provide unmatched customer support and tailored energy solutions to meet your needs with excellence and efficiency.</p>
              </div>
            </div>
            <div className="group text-center">
              <div className="transform transition-transform duration-300 hover:scale-105">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  {/* Expert Team Icon */}
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-3.13V7a4 4 0 00-3-3.87M7 7V7a4 4 0 013-3.87" /></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Expert Team</h3>
                <p className="text-gray-600">Our team of skilled professionals is dedicated to delivering top-notch solutions and reliable support every step of the way.</p>
              </div>
            </div>
            <div className="group text-center">
              <div className="transform transition-transform duration-300 hover:scale-105">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  {/* Safety First Icon */}
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 00-7.7 16.29l7.7 3.71 7.7-3.71A10 10 0 0012 2z" /></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Safety First</h3>
                <p className="text-gray-600">Built-in protection features ensure safe operation, preventing overcharging, overheating, and short circuits for total peace of mind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
