/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				lightbg: '#FFF1CA',
				lightaccent: '#FFB823',
				lightmuted: '#708A58',
				lighttext: '#2D4F2B',
			},
			backdropBlur: {
				sm: '4px',
			  },
			
			
		  },
		},
	plugins: [],
}
