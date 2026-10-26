/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          hover: 'var(--surface-hover)',
          secondary: 'var(--surface-secondary)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          subtle: 'var(--border-subtle)',
          focus: 'var(--focus-ring)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          foreground: 'var(--accent-foreground)',
          primary: 'var(--accent)',
          'primary-hover': 'var(--accent-hover)',
          secondary: 'var(--accent-secondary)',
          glow: 'var(--accent-glow)',
        },
        input: {
          background: 'var(--input-background)',
          text: 'var(--input-text)',
        },
        popover: {
          background: 'var(--popover-background)',
          text: 'var(--popover-text)',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          pending: 'var(--status-pending)',
          error: 'var(--status-error)',
        },
        // Backward-compatibility aliases
        app: {
          bg: 'var(--background)',
          surface: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          secondary: 'var(--surface-secondary)',
          border: 'var(--border)',
          'border-subtle': 'var(--border-subtle)',
          'border-focus': 'var(--focus-ring)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 43, 77, 0.06), 0 1px 2px 0 rgba(23, 43, 77, 0.04)',
        'surface': '0 1px 2px rgba(23, 43, 77, 0.025), 0 8px 24px rgba(23, 43, 77, 0.035)',
        'elevated': '0 16px 36px -12px rgba(23, 43, 77, 0.16), 0 5px 12px -6px rgba(23, 43, 77, 0.08)',
        'glow-primary': '0 0 18px -5px rgba(36, 87, 197, 0.28)',
      }
    },
  },
  plugins: [],
}
