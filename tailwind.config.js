/* eslint-disable no-param-reassign */
const plugin = require('tailwindcss/plugin');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  jit: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: '#0062ff',
        danger: '#c0392b',
        warning: '#FF6600',
        success: '#408558',
        light: '#F5F8FA',
        info: '#0dcaf0',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addVariant, e }) => {
      addUtilities({
        '.flex-center': {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.outline-r': {
          outline: 'solid',
          'outline-width': '2px',
          'outline-color': 'red',
        },
        '.outline-b': {
          outline: 'solid',
          'outline-width': '2px',
          'outline-color': 'blue',
        },
        '.outline-d': {
          outline: 'solid',
          'outline-width': '2px',
          'outline-color': 'black',
        },
        '.outline-g': {
          outline: 'solid',
          'outline-width': '2px',
          'outline-color': 'green',
        },
        '.outline-o': {
          outline: 'solid',
          'outline-width': '2px',
          'outline-color': 'orange',
        },
      });

      addVariant('data-active', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`data-active${separator}${className}`)}[data-active="true"]`;
        });
      });
    }),
  ],
};
