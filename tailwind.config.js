/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryHover: "#1D4ED8",
        primaryLight: "#60A5FA",

        page: "#F9FAFB",

        card: "#FFFFFF",

        heading: "#1F2937",

        bodyText: "#010203",

        muted: "#6B7280",

        borderColor: "#D1D5DB",

        glassWhite: "rgba(255,255,255,0.2)",

        overlayDark: "rgba(0,0,0,0.4)",

        overlaySoft: "rgba(0,0,0,0.3)",

        // ADDED COLORS
        headingText: "#1F2937",

        mutedText: "#6B7280",

        cardBg: "#FFFFFF",

        hoverBg: "#F3F4F6",

        borderMain: "#D1D5DB",

        // PROFILE GRADIENT
        profileGradientFrom: "#4F46E5",

        profileGradientVia: "#7C3AED",

        profileGradientTo: "#EC4899",
      },
    },
  },
  plugins: [require("daisyui")],
};
