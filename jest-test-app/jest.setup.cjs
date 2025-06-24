require('@testing-library/jest-dom');

// Mock Vite environment variables
globalThis.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://test-api',
    },
  },
};