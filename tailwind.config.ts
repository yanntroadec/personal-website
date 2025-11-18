import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS Configuration
 *
 * Defines the design system for the portfolio website.
 * Uses Tailwind CSS v4 with custom theme extensions.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom cyan accent color used throughout the site
        // Used for borders, highlights, links, and interactive elements
        'cyan-custom': '#22d3ee',
      },
      fontFamily: {
        // Monospace font for code and technical content
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      animation: {
        // Custom fade-in animation for page transitions
        'fade-in-slow': 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
