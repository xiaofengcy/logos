module.exports = {
  rootDir: '../',
  transform: {
    '.*': 'babel-jest',
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
  ],
  moduleDirectories: [
    'node_modules',
    'app/scripts',
    './',
  ],
  moduleNameMapper: {
    '^app-store': '<rootDir>/app/scripts/store',
    '^.+\\.(css|scss)$': '<rootDir>/test/__setup__/styleMock.js',
    '^(.+\\.(jpe?g|png|gif|webp|md|ttf|eot|svg|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)|bootstrap.*)$': '<rootDir>/test/__setup__/fileMock.js',
    '^(expose|bundle)': '<rootDir>/test/__setup__/moduleMock.js',
  },
  setupFiles: [
    'jest-localstorage-mock',
    '<rootDir>/test/__setup__/shim.js',
    '<rootDir>/test/__setup__/index.js',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/node_modules/jest-enzyme/lib/index.js',
  testRegex: '/test/.*?\\.(test|spec)\\.js$',
  testURL: 'http://localhost:3000/',
  collectCoverage: false,
  collectCoverageFrom: [
    'app/scripts/**/*.{js,jsx}',
    '!app/scripts/**/*.dev.{js,jsx}',
    '!app/scripts/vendor/*',
  ],
  coverageThreshold: {
    global: {
      statements: 35,
      branches: 25,
      functions: 45,
      lines: 35,
    },
  },
  verbose: true,
};
