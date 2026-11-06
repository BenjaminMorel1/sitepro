/** @type {import('tailwindcss').Config} */
/* thème noir : classe "dark" sur <html> (posée par src/theme.ts), utilisée par les variantes dark: */
export default {
  /* hover: seulement sur souris/trackpad : sur téléphone, un tap ne laisse plus l'effet « collé » */
  future: { hoverOnlyWhenSupported: true },
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
