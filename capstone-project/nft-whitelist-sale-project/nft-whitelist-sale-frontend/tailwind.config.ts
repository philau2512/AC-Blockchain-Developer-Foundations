import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#e6f0ff",
          200: "#cce1ff",
          300: "#99c2ff",
          400: "#6699ff",
          500: "#4880FF", // Main
          600: "#3366cc",
          700: "#1f4099",
          800: "#0a2d66",
        },
        white: {
          100: "#ffffff",
        },
        gray: {
          100: "#f9f9f9",
          200: "#f0f0f0",
          300: "#e0e0e0",
          400: "#d0d0d0",
          500: "#b0b0b0",
        },
      },
    },
  },
  plugins: [
  ],
};
export default config;
