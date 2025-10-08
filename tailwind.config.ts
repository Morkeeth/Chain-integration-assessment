import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ledger: {
          black: '#000000',
          white: '#FFFFFF',
          orange: '#FF5A00',
          green: '#00D4AA',
          yellow: '#FFB800',
          red: '#EA2E49',
          gray: {
            50: '#F7F7F7',
            100: '#E8E8E8',
            200: '#D1D1D1',
            300: '#B8B8B8',
            400: '#9F9F9F',
            500: '#868686',
            600: '#6D6D6D',
            700: '#545454',
            800: '#3B3B3B',
            900: '#222222',
          }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};

export default config;
