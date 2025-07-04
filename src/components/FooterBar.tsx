import React from 'react'

export default function FooterBar({ email, phone, facebook, youtube, instagram }: { email: string, phone: string, facebook?: string, youtube?: string, instagram?: string }) {
  return (
    <footer className="w-full bg-neutral-900/80 text-neutral-200 py-7 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-base md:text-lg">
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-1 hover:text-green-500 transition-colors"
          title="Call"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle"><path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z"/></svg>
          <span className="hidden sm:inline">{phone}</span>
        </a>
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
          title="Email"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8l8 5 8-5v10z"/></svg>
          <span className="hidden sm:inline">{email}</span>
        </a>
        {facebook && (
          <a href={facebook} target="_blank" rel="noopener noreferrer" className="ml-4 hover:text-blue-400 transition-colors" title="Facebook">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle"><path d="M22.676 0h-21.352c-.731 0-1.324.593-1.324 1.326v21.348c0 .73.593 1.326 1.324 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.919.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.294h6.116c.73 0 1.324-.596 1.324-1.326v-21.349c0-.733-.594-1.326-1.324-1.326z"/></svg>
          </a>
        )}
        {youtube && (
          <a href={youtube} target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-red-500 transition-colors" title="YouTube">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle"><path d="M23.498 6.186a2.993 2.993 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.993 2.993 0 0 0 .502 6.186C0 8.2 0 12 0 12s0 3.8.502 5.814a2.993 2.993 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.993 2.993 0 0 0 2.107-2.117C24 15.8 24 12 24 12s0-3.8-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        )}
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-pink-500 transition-colors" title="Instagram">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.314.974.974 1.252 2.241 1.314 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.314 3.608-.974.974-2.241 1.252-3.608 1.314-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.314-.974-.974-1.252-2.241-1.314-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.314-3.608C4.521 2.573 5.788 2.295 7.154 2.233 8.42 2.175 8.8 2.163 12 2.163zm0-2.163C8.736 0 8.332.012 7.052.07 5.77.128 4.665.366 3.7 1.332c-.965.965-1.204 2.07-1.262 3.352C2.012 5.668 2 6.072 2 9.337v5.326c0 3.265.012 3.669.07 4.949.058 1.282.297 2.387 1.262 3.352.965.965 2.07 1.204 3.352 1.262 1.28.058 1.684.07 4.949.07s3.669-.012 4.949-.07c1.282-.058 2.387-.297 3.352-1.262.965-.965 1.204-2.07 1.262-3.352.058-1.28.07-1.684.07-4.949V9.337c0-3.265-.012-3.669-.07-4.949-.058-1.282-.297-2.387-1.262-3.352-.965-.965-2.07-1.204-3.352-1.262C15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
        )}
      </div>
    </footer>
  )
}
