/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Army Wide Medium اصل meta-data کے مطابق
      // اب Army Wide نہیں بلکہ Stencil system font استعمال ہو رہا ہے
// Stardos Stencil (Google Fonts) اب استعمال ہو رہا ہے
fontFamily: {
  army: ['Stardos Stencil', 'sans-serif'],
},
      colors: {
        primary: '#1a56db',
        secondary: '#10b981',
      },
    },
  },
  plugins: [],
}
