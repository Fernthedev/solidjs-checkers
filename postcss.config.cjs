module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },

  daisyui: {
    themes: ["emerald", "night"],
    darkTheme: "night",
  },
}
