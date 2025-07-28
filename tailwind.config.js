/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{htm,js}"],
  theme: {
    extend: {},
     screens: {
      "sm": "640px",
      // => @media (min-width: 640px) { ... }
      "tab" : "800px",
      // => @media (min-width: 800px) { ... }
      "nm": "500px",
      "dl" : "400px",
      // => @media (min-width: 400px) { ... }
      "ts" : "300px",
            // => @media (min-width: 300px) { ... }
      "ex-sm" : "200px",
              // => @media (min-width: 200px) { ... }
      "lg": "1024px",
      // => @media (min-width: 1024px) { ... }

      "xl": "1280px",
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
}

