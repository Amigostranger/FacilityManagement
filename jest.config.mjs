// jest.config.mjs
export default {
    collectCoverage: true,
    collectCoverageFrom: [
      'public/js/**/*.js',
      '!public/js/tests/**',
      '!public/js/firebase.js'
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
  
    extensionsToTreatAsEsm: ['.js'], // <-- This tells Jest to treat .js files as ESM
  
    // Optional: silence experimental warnings
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  };
  