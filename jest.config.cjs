// jest.config.js
module.exports = {
  // Use 'ts-jest' preset for TypeScript files
  preset: 'ts-jest',

  // Set the test environment to 'jsdom' to simulate a browser environment
  testEnvironment: 'jsdom',

  // Module file extensions for importing modules
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Transforms for processing files
  transform: {
    // Use ts-jest for .ts and .tsx files
    '^.+\\.(ts|tsx)$': 'ts-jest',
    // Use babel-jest for .js and .jsx files (if you have any)
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Configuration for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Point to your main tsconfig.json
    },
  },

  // Setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Ensure this path is correct

  // Regex for test files
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx|js|jsx)'],

  // Mocks for CSS and other assets
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js', // Example mock for assets
  },
};