/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Cool, quiet neutral palette (chroma 0.005) — see reference_design_language
        stone: {
          50:  'oklch(0.985 0.002 240)',
          100: 'oklch(0.970 0.003 240)',
          200: 'oklch(0.920 0.004 240)',
          300: 'oklch(0.850 0.005 240)',
          400: 'oklch(0.720 0.006 240)',
          500: 'oklch(0.590 0.006 240)',
          600: 'oklch(0.470 0.006 240)',
          700: 'oklch(0.370 0.006 240)',
          800: 'oklch(0.250 0.006 240)',
          900: 'oklch(0.170 0.006 240)',
          950: 'oklch(0.110 0.005 240)',
        },
        // Warmth reserved for hero — the snail's shell
        shell: {
          50:  'oklch(0.985 0.014 70)',
          100: 'oklch(0.960 0.024 70)',
          200: 'oklch(0.910 0.040 70)',
          300: 'oklch(0.840 0.060 70)',
          400: 'oklch(0.740 0.080 70)',
          500: 'oklch(0.640 0.095 65)',
          600: 'oklch(0.540 0.100 60)',
          700: 'oklch(0.440 0.090 55)',
          800: 'oklch(0.340 0.075 50)',
          900: 'oklch(0.240 0.055 45)',
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: theme('colors.stone.800'),
            a: { color: theme('colors.shell.700'), textDecoration: 'underline' },
          },
        },
      }),
    },
  },
  plugins: [],
};
