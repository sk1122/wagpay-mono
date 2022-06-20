module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wagpay-dark': '#101010',
        'wagpay-primary': '#FF633B',
        "wagpay-card-bg" : "#191919", 
        "wagpay-card-bg-secondary": "#464646"
      },
      screens: {
        mobile: '415px',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
  ],
};
