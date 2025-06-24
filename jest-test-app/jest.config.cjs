module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        // diagnostics: {
        //   ignoreCodes: [1343] // Ignore import.meta errors in tests
        // },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_URL: 'http://test-api'
                  }
                }
              }
            }
          ]
        }
      }
    ]
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};