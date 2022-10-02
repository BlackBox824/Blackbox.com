/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{ts,tsx}'],
	theme: {
		fontFamily: {
			sans: [
				'Montserrat',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'Noto Sans',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji',
			],
			serif: ['Abril_Fatface', 'serif'],
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
