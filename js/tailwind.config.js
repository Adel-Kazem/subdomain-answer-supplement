// js/tailwind.config.js - Updated GreenLion Tailwind Configuration for SPA
tailwind.config = {
    theme: {
        extend: {
            // Font Families
            fontFamily: {
                'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                'display': ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                'primary': ['Inter', 'sans-serif'],
                'secondary': ['Space Grotesk', 'sans-serif']
            },

            // GreenLion Enhanced Color System
            colors: {
                // Primary Brand Colors (Professional Green for Electronics)
                'primary': {
                    DEFAULT: '#065f46', // emerald-800 - Main brand color
                    hover: '#047857',   // emerald-700 - Hover state
                    light: '#10b981',  // emerald-500 - Lighter variant
                    focus: '#059669',  // emerald-600 - Focus rings
                    text: '#ffffff',   // White text for dark backgrounds
                    50: '#ecfdf5',     // Very light green
                    100: '#d1fae5',    // Light green
                    200: '#a7f3d0',    // Lighter green
                    300: '#6ee7b7',    // Light green
                    400: '#34d399',    // Medium-light green
                    500: '#10b981',    // Medium green (light variant)
                    600: '#059669',    // Medium-dark green (focus)
                    700: '#047857',    // Dark green (hover)
                    800: '#065f46',    // Darker green (main)
                    900: '#064e3b',    // Darkest green
                },

                // Accent Colors for Highlights and CTAs
                'accent': {
                    DEFAULT: '#f59e0b', // amber-500
                    light: '#fef3c7',   // amber-100
                    hover: '#d97706',   // amber-600
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },

                // Status Colors
                'success': {
                    DEFAULT: '#10b981',
                    light: '#d1fae5',
                    dark: '#047857',
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                },

                'warning': {
                    DEFAULT: '#f59e0b',
                    light: '#fef3c7',
                    dark: '#d97706',
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#f59e0b',
                    600: '#d97706',
                },

                'error': {
                    DEFAULT: '#ef4444',
                    light: '#fee2e2',
                    dark: '#dc2626',
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                },

                'info': {
                    DEFAULT: '#3b82f6',
                    light: '#dbeafe',
                    dark: '#2563eb',
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                },

                // WhatsApp Brand Colors
                'whatsapp': {
                    DEFAULT: '#25d366',
                    hover: '#128c7e',
                    light: '#dcf8c6',
                },

                // Enhanced Gray Scale for Better Design
                'neutral': {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                },
            },

            // Extended Spacing Scale
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
                '144': '36rem',
                '160': '40rem',
                '176': '44rem',
                '192': '48rem',
            },

            // Extended Screen Sizes for Better Responsive Design
            screens: {
                'xs': '475px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                '3xl': '1600px',
                '4xl': '1920px',
            },

            // Enhanced Box Shadows
            boxShadow: {
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                'product': '0 4px 12px -2px rgb(0 0 0 / 0.1), 0 2px 6px -2px rgb(0 0 0 / 0.05)',
                'card-hover': '0 12px 24px -6px rgb(0 0 0 / 0.15), 0 4px 8px -2px rgb(0 0 0 / 0.1)',
                'button': '0 4px 14px 0 rgb(0 0 0 / 0.1)',
                'button-hover': '0 6px 20px 0 rgb(0 0 0 / 0.15)',
                'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
            },

            // Border Radius Scale
            borderRadius: {
                'none': '0',
                'sm': '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
                'full': '9999px',
            },

            // Enhanced Animation System
            animation: {
                // Fade animations
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'fade-in-left': 'fadeInLeft 0.6s ease-out',
                'fade-in-right': 'fadeInRight 0.6s ease-out',

                // Slide animations
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-left': 'slideLeft 0.4s ease-out',
                'slide-right': 'slideRight 0.4s ease-out',

                // Scale animations
                'scale-up': 'scaleUp 0.2s ease-out',
                'scale-down': 'scaleDown 0.2s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',

                // Bounce and elastic
                'bounce-gentle': 'bounceGentle 2s infinite',
                'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'elastic-in': 'elasticIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',

                // Loading animations
                'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
                'shimmer': 'shimmer 1.5s infinite',
                'skeleton': 'skeleton 1.5s ease-in-out infinite',

                // Utility animations
                'float': 'float 3s ease-in-out infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',

                // Page transition animations
                'page-enter': 'pageEnter 0.4s ease-out',
                'page-leave': 'pageLeave 0.3s ease-in',

                // Cart animations
                'cart-bounce': 'cartBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'cart-slide-in': 'cartSlideIn 0.4s ease-out',
                'cart-slide-out': 'cartSlideOut 0.3s ease-in',

                // Modal animations
                'modal-enter': 'modalEnter 0.3s ease-out',
                'modal-leave': 'modalLeave 0.2s ease-in',
                'backdrop-enter': 'backdropEnter 0.3s ease-out',
                'backdrop-leave': 'backdropLeave 0.2s ease-in',
            },

            // Custom Keyframes
            keyframes: {
                // Fade keyframes
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                fadeInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                fadeInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },

                // Slide keyframes
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideLeft: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },

                // Scale keyframes
                scaleUp: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                scaleDown: {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.95)' }
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },

                // Bounce keyframes
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                bounceIn: {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                elasticIn: {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '60%': { opacity: '1', transform: 'scale(1.1)' },
                    '80%': { transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },

                // Loading keyframes
                pulseSlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' }
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                },
                skeleton: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' }
                },

                // Utility keyframes
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' }
                },

                // Page transition keyframes
                pageEnter: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                pageLeave: {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-20px)' }
                },

                // Cart keyframes
                cartBounce: {
                    '0%': { transform: 'scale(0)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' }
                },
                cartSlideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                cartSlideOut: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(20px)' }
                },

                // Modal keyframes
                modalEnter: {
                    '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
                },
                modalLeave: {
                    '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                    '100%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' }
                },
                backdropEnter: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                backdropLeave: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                }
            },

            // Enhanced Typography
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['8rem', { lineHeight: '1' }],
            },

            // Letter Spacing
            letterSpacing: {
                'tighter': '-0.05em',
                'tight': '-0.025em',
                'normal': '0em',
                'wide': '0.025em',
                'wider': '0.05em',
                'widest': '0.1em',
            },

            // Line Height
            lineHeight: {
                'none': '1',
                'tight': '1.25',
                'snug': '1.375',
                'normal': '1.5',
                'relaxed': '1.625',
                'loose': '2',
            },

            // Backdrop Blur
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '24px',
                '3xl': '40px',
            },

            // Z-Index Scale
            zIndex: {
                '0': '0',
                '10': '10',
                '20': '20',
                '30': '30',
                '40': '40',
                '50': '50',
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },

            // Aspect Ratios
            aspectRatio: {
                'square': '1',
                '4/3': '4 / 3',
                '3/2': '3 / 2',
                '16/9': '16 / 9',
                '21/9': '21 / 9',
                '3/4': '3 / 4',
                '2/3': '2 / 3',
            },

            // Grid Template Columns
            gridTemplateColumns: {
                'auto-fit': 'repeat(auto-fit, minmax(0, 1fr))',
                'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
                'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
                'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
                'auto-fit-350': 'repeat(auto-fit, minmax(350px, 1fr))',
            },

            // Transition Duration
            transitionDuration: {
                '0': '0ms',
                '75': '75ms',
                '100': '100ms',
                '150': '150ms',
                '200': '200ms',
                '300': '300ms',
                '500': '500ms',
                '700': '700ms',
                '1000': '1000ms',
            },

            // Transition Timing Function
            transitionTimingFunction: {
                'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
                'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
            },

            // Content
            content: {
                'empty': '""',
            },
        }
    },

    // Additional Plugins and Variants
    variants: {
        extend: {
            backgroundColor: ['active', 'group-hover', 'group-focus', 'disabled'],
            borderColor: ['active', 'group-hover', 'group-focus', 'disabled'],
            textColor: ['active', 'group-hover', 'group-focus', 'disabled'],
            opacity: ['group-hover', 'group-focus', 'disabled'],
            scale: ['group-hover', 'group-focus'],
            transform: ['group-hover', 'group-focus'],
            translate: ['group-hover', 'group-focus'],
            rotate: ['group-hover', 'group-focus'],
            skew: ['group-hover', 'group-focus'],
        }
    },

    // Safelist important classes that might be dynamically generated
    safelist: [
        // Brand colors
        'text-primary',
        'text-primary-hover',
        'bg-primary',
        'bg-primary-hover',
        'border-primary',
        'ring-primary',

        // Status colors
        'text-success',
        'text-error',
        'text-warning',
        'text-info',
        'bg-success',
        'bg-error',
        'bg-warning',
        'bg-info',

        // WhatsApp colors
        'bg-whatsapp',
        'bg-whatsapp-hover',
        'text-whatsapp',

        // Interactive states
        'hover:bg-primary-hover',
        'hover:text-primary-hover',
        'focus:ring-primary',
        'focus:border-primary',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',

        // Animation classes
        'animate-fade-in',
        'animate-slide-up',
        'animate-scale-in',
        'animate-bounce-gentle',
        'animate-shimmer',
        'animate-cart-bounce',

        // Layout utilities
        'aspect-square',
        'line-clamp-1',
        'line-clamp-2',
        'line-clamp-3',

        // Grid patterns
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
        'grid-cols-4',
        'md:grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-4',

        // Responsive spacing
        'px-4',
        'px-6',
        'py-2',
        'py-3',
        'py-4',
        'py-6',
        'py-8',
        'py-12',
        'py-16',
        'py-20',

        // Common shadows
        'shadow-sm',
        'shadow-md',
        'shadow-lg',
        'shadow-xl',
        'shadow-product',
        'shadow-card-hover',
    ],

    // Core Plugins
    corePlugins: {
        preflight: true,
    },

    // Important selector for better CSS specificity
    important: false,

    // Prefix for Tailwind classes (if needed)
    prefix: '',

    // Separator for responsive variants
    separator: ':',
};
