
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        // Removed "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // sans: ["var(--font-geist-sans)"], // Removed Geist Sans
                // mono: ["var(--font-geist-mono)"], // Removed Geist Mono
                furore: ["var(--font-furore)"], // Add Furore font from CSS variable
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
             keyframes: {
                 // Keyframes are defined in globals.css
                 'accordion-down': {
                     from: { height: '0' },
                     to: { height: 'var(--radix-accordion-content-height)' },
                 },
                 'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                 },
            },
            animation: {
                 // Animations are defined in globals.css
                 'accordion-down': 'accordion-down 0.2s ease-out',
                 'accordion-up': 'accordion-up 0.2s ease-out',
                 'float': 'float 3s ease-in-out infinite', // Keep basic animations if needed elsewhere
                 // Map CSS animation names to Tailwind utilities
                 'hero-content-appear': 'hero-content-appear 1.2s ease-out forwards',
                 'contact-content-appear': 'contact-content-appear 1s ease-out forwards 0.5s',
                 'form-elements-appear': 'form-elements-appear 0.6s ease-out forwards', // Might be redundant if using slide animations
                 'wave-animation': 'wave-animation 3s ease-in-out infinite',
                 'bounce': 'bounce 2s infinite',
                 'videoAppear': 'videoAppear 1.5s ease-out forwards',
                 'contentZoomIn': 'contentZoomIn 1s ease-out forwards 0.5s',
                 'titleAppear': 'titleAppear 1s ease-out forwards 0.7s',
                 'subtitleAppear': 'subtitleAppear 1s ease-out forwards 0.9s',
                 'scrollAppear': 'scrollAppear 1s ease-out forwards 1.1s',
                 'logoAppear': 'logoAppear 1s ease-out forwards 0.2s',
                 'phone-shake': 'phoneShakeAnim 0.38s cubic-bezier(0.4,0,0.2,1) infinite',
                 'bounce-header': 'bounce-header 0.6s cubic-bezier(0.6,0.05,0.4,1)',
                 'privacyModalSlideUp': 'privacyModalSlideUp 0.5s ease-out forwards',
                 'privacyModalSlideDown': 'privacyModalSlideDown 0.5s ease-in forwards',
                 'arrowBlink': 'arrowBlink 1.1s infinite alternate',
                 'slideFromLeft': 'slideFromLeft 0.8s ease forwards',
                 'slideFromRight': 'slideFromRight 0.8s ease forwards',
                 'slideFromBottom': 'slideFromBottom 0.8s ease forwards 0.4s',
            }
        }
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
