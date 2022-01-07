const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/projects/ngx-ccu-jack-client/tsconfig.spec.json',
    },
  },
  reporters:  [
    'default',
    ['./node_modules/jest-html-reporter', {
      'pageTitle': "Test Report",
      'outputPath': "<rootDir>/dist/reports/test-results.html"
    }]
  ],
  coverageDirectory: "<rootDir>/dist/reports",
};
