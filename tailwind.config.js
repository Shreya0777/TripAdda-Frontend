/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand / actions
        primary: "#2563EB",
        primaryHover: "#1D4ED8",
        primaryFocus: "#60A5FA",
        accent: "#F97316",
        accentHover: "#EA580C",
        

        // Layout backgrounds
        pageBg: "#F9FAFB",
        sectionBg: "#F3F4F6",
        cardBg: "#FFFFFF",
        subtleBg: "#E5E7EB",
        hoverBg: "#F3F4F6",
        activeBg: "#D1D5DB",
        darkBg: "#000000",

        // Text colors
        headingText: "#111827",
        bodyText: "#374151",
        mutedText: "#6B7280",
        lightText: "#9CA3AF",
        inverseText: "#FFFFFF",
        inputText: "#000000",
        linkText: "#2563EB",
        linkHoverText: "#1D4ED8",
        dangerText: "#EF4444",
        dangerHoverText: "#B91C1C",

        // Borders / rings
        borderMain: "#D1D5DB",
        borderSoft: "#E5E7EB",
        borderInverse: "#FFFFFF",
        danger: "#EF4444",
        focusRing: "#3B82F6",
        focusRingSoft: "#60A5FA",

        // Buttons
        buttonPrimaryBg: "#2563EB",
        buttonPrimaryHoverBg: "#1D4ED8",
        buttonPrimaryText: "#FFFFFF",
        buttonDangerBg: "#EF4444",
        buttonDangerHoverBg: "#DC2626",

        // Overlays / glass
        glassWhite: "rgba(255,255,255,0.2)",
        overlayDark: "rgba(0,0,0,0.4)",
        overlaySoft: "rgba(0,0,0,0.3)",

        // Profile gradient
        profileGradientFrom: "#4F46E5",
        profileGradientVia: "#7C3AED",
        profileGradientTo: "#EC4899",

        // Backward-compatible aliases
        primaryLight: "#60A5FA",
        page: "#F9FAFB",
        card: "#FFFFFF",
        heading: "#111827",
        muted: "#6B7280",
        borderColor: "#D1D5DB",
      },
    },
  },
  plugins: [require("daisyui")],
};
