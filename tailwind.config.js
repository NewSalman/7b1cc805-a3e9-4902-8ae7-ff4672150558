/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "**/**/*.hbs"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /^p-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /^px-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /^py-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /^pt-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /^pr-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /^pb-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /^pl-[0-9]+$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /text-blue-[0-9]+$/,
    },
    {
      pattern: /rotate-180/,
    },
  ],
  plugins: [],
}

