require('@testing-library/jest-dom');

globalThis.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://test-api',
    },
  },
};