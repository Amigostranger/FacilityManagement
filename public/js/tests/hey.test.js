/**
 * @jest-environment jsdom
 */
//import '@testing-library/jest-dom';
const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');
require('jest-fetch-mock').enableMocks();

// Enable fetch mocks
//fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
  document.body.innerHTML = `
    <table id="bookingsTable"><tbody></tbody></table>
    <div id="bookingModal" hidden></div>
    <span id="modalTitle"></span>
    <span id="modalDescription"></span>
    <span id="modalFacility"></span>
    <span id="modalStart"></span>
    <span id="modalEnd"></span>
    <div id="drop"></div>
    <button id="saveStatusBtn"></button>
    <button id="cancelBtn"></button>
  `;
});

test('Admin approves a booking and status is updated', async () => {
  const { loadBookings, updateStatus } = await import('../staff_admin_booking.js');

  // Mock response for users and bookings
  fetch.mockResponses(
    // Mock for get-users
    [JSON.stringify([{ id: 'abc123', username: 'testuser' }]), { status: 200 }],
    // Mock for staff-bookings
    [JSON.stringify([{ bookId: 'book1', submittedBy: 'abc123', Title: 'Match', Description: 'Game', facility: 'Field', start: '2025-05-10', end: '2025-05-11' }]), { status: 200 }]
  );

  await loadBookings();

  const viewButton = document.querySelector('.viewBtn');
  fireEvent.click(viewButton);

  const dropdown = document.querySelector('.bookselector');
  dropdown.value = 'Approved';
  fireEvent.change(dropdown);

  // Prepare status update endpoint
  fetch.mockResponseOnce(JSON.stringify({ message: "Status updated" }));

  const saveBtn = document.getElementById('saveStatusBtn');
  fireEvent.click(saveBtn);

  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/booking-status/book1'),
    expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ bookId: 'book1', status: 'Approved' })
    })
  );
});
