// src/mocks/envMock.ts
const env = {
  VITE_API_URL: 'http://test-api',
  // Add any other Vite environment variables your app uses,
  // even if they are empty strings for tests.
  // E.g., VITE_SOME_OTHER_VAR: 'test-value',
};

// This needs to be a default export as moduleNameMapper treats it as such
export default {
  env: env
};