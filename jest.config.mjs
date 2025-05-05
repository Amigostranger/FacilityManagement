export default {
  collectCoverage: true,
  collectCoverageFrom: [
    'public/js/tests/**/*.js',  // Collect coverage from all .js files in the public/js/tests folder
    '!public/js/tests/**/testHelpers.js',  // Exclude any helper files, if applicable
    '!public/js/tests/setupTests.js'  // Exclude setup files, if necessary
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',

  // Use babel-jest to transform modern ESM code
  transform: {
    '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },

  transformIgnorePatterns: [
    '/node_modules/(?!firebase)/'
  ],

  // Optional: silence experimental warnings
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
};
