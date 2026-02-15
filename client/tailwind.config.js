/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9', // Sky blue
                secondary: '#6366f1', // Indigo
                accent: '#f43f5e', // Rose
                dark: '#0f172a', // Slate 900
                light: '#f8fafc', // Slate 50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
            }
        },
    },
    plugins: [],
}
