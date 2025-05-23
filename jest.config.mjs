export default {
  collectCoverage: true,
collectCoverageFrom: [
  "public/js/**/*.js",
  "!**/node_modules/**",
  "!public/js/createEvent.js",
  "!public/js/list_residents.js",
  "!public/js/list_users.js",
  "!public/js/login.js",
  "!public/js/reports_dashboard.js",
  "!public/js/resident.js",
  "!public/js/googlesignIn.js",
  "!public/js/resident_new_booking.js",
  "!public/js/resident_report_issue.js",
  "!public/js/staff.js",
  "!public/js/staff_admin_booking.js",
  "!public/js/staff_admin_issues.js",
  "!public/js/viewBookings.js",
  "!public/js/viewMyIssues.js",
  "!public/js/viewnotifications.js",
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
  setupFiles: ['./jest.setup.js']
};
