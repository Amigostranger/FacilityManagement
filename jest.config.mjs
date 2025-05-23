export default {
  collectCoverage: true,
collectCoverageFrom: [
  "public/js/**/*.js",
  
  "!**/node_modules/**",
  "!**/Tests/**"
],
coverageDirectory: "coverage",
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
