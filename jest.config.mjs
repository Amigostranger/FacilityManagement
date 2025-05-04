export default {
  collectCoverage: true,
  collectCoverageFrom: [
    'public/js/tests/**/*.js' // ✅ Only collect from tests folder
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.js$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },

  transformIgnorePatterns: [
    '/node_modules/(?!firebase)/'
  ],

  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
};
