// tailwind.config.js
/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",   // ← 반드시 포함
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}