/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3238f2",
        secondary: "#373737",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundColor: {
        primary: "#3238f2",
        secondary: "#f5f0f0",
        whitebg: "#f1f1f1",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(10)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
      },
      screens: {
        tablet: "600px", // sm & md
        laptop: "1030px", // lg
        desktop: "1280px", // xl
        "2xl": "1536px",
      },
    },
  },
  plugins: [require("tailwindcss-motion")],
};
