const path = require('path');

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  rootDir: path.resolve(__dirname, '../'),
  verbose: true,
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  mapCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  testRegex: '(<rootDir>/test/unit/specs/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  collectCoverageFrom: [
    'src/components/vc-cat/*.{js,vue}',
    '!src/components/vc-cat/index.js',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  'testURL': 'http://localhost'
};
