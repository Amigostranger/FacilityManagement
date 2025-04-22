module.exports = {
  transform: {},
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "public/js/**/*.js",
    "!public/js/tests/**"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"]
};