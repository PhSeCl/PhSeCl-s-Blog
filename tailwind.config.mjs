import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: 'var(--bg-deep)',
          surface: 'var(--bg-surface)',
        },
        sakura: {
          50: 'var(--sakura-50)',
          100: 'var(--sakura-100)',
          200: 'var(--sakura-200)',
          300: 'var(--sakura-300)',
          400: 'var(--sakura-400)',
          500: 'var(--sakura-500)',
          600: 'var(--sakura-600)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
        },
      },
      fontFamily: {
        display: ['"Zen Old Mincho"', 'serif'],
        body: ['"Shippori Mincho"', 'serif'],
        ui: ['"Noto Sans JP"', 'sans-serif'],
      },
      boxShadow: {
        sakura: '0 20px 60px rgba(160, 60, 100, 0.12)',
      },
      typography: () => ({
        sakura: {
          css: {
            '--tw-prose-body': 'var(--text-primary)',
            '--tw-prose-headings': 'var(--sakura-100)',
            '--tw-prose-links': 'var(--sakura-300)',
            '--tw-prose-bold': 'var(--sakura-100)',
            '--tw-prose-counters': 'var(--text-muted)',
            '--tw-prose-bullets': 'var(--sakura-400)',
            '--tw-prose-hr': 'var(--border-subtle)',
            '--tw-prose-quotes': 'var(--sakura-100)',
            '--tw-prose-quote-borders': 'var(--sakura-400)',
            '--tw-prose-captions': 'var(--text-muted)',
            '--tw-prose-code': 'var(--sakura-200)',
            '--tw-prose-pre-code': 'var(--sakura-100)',
            '--tw-prose-pre-bg': 'rgba(13, 8, 16, 0.88)',
            '--tw-prose-th-borders': 'var(--border-subtle)',
            '--tw-prose-td-borders': 'var(--border-subtle)',
          },
        },
      }),
    },
  },
  plugins: [typography],
};

