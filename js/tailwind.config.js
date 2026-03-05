tailwind.config = {
    theme: {
        extend: {
            colors: {
                'kv-green': '#1f4e3d',
                'kv-green-light': '#326a56',
                'kv-gold': '#d4af37',
                'kv-gold-light': '#e8c867',
                'kv-dark': '#1a1a1a',
                'kv-bg': '#faf9f6',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: 0, transform: 'translateY(30px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                }
            }
        }
    }
}
