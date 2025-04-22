// Assuming staff.js contains the code with the event listener
const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

// Your test
test('should change location to staff_admin_issues.html on button click', () => {

  document.body.innerHTML = `
    <button id="reportBtn">Report</button>
  `;
  
  const mockLocation = { href: '' };
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
  });

  require('../staff.js'); 

  const reportBtn = document.getElementById('reportBtn');
  fireEvent.click(reportBtn);

  expect(mockLocation.href).toBe('./staff_admin_issues.html');
});
