/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-primary": "#000000",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: 1 }, // Fully visible at the start and end
          "50%": { opacity: 0 }, // Fully hidden at 50%
        },
      },
      animation: {
        "fade-in-out": "fadeInOut 3s ease-in-out infinite", // Customize duration and easing
      },
      boxShadow: {
        "tour-helper-shadow": "0px 2px 4px 0px #00000040",
      },
      screens: {
        md: "769px", // Override the default md breakpoint to start at 744px
      },
    },
  },
  plugins: [],
};
