/**
 * @jest-environment jsdom
 */
import { renderAdminUsers } from '../adminRevokeDom.js';
import { fetchAdminUsers, revokeAdminUser, updateUserRole } from '../adminRevokeFun.js';

jest.mock('../adminRevokeFun.js', () => ({
  fetchAdminUsers: jest.fn(),
  revokeAdminUser: jest.fn(),
  updateUserRole: jest.fn()
}));

beforeEach(() => {
  document.body.innerHTML = `
    <table>
      <tbody id="userTableBody"></tbody>
    </table>
  `;
});

test('renders users excluding admin role', async () => {
  fetchAdminUsers.mockResolvedValue([
    { id: '1', email: 'a@example.com', username: 'Alice', role: 'staff' },
    { id: '2', email: 'b@example.com', username: 'Bob', role: 'resident' }
  ]);

  await renderAdminUsers();

  const rows = document.querySelectorAll('tbody tr');
  expect(rows.length).toBe(2);
  expect(rows[0].innerHTML).toContain('a@example.com');
  expect(rows[1].innerHTML).toContain('b@example.com');
});

test('calls revokeAdminUser on Revoke button click', async () => {
  window.confirm = jest.fn(() => true); // Simulate confirmation
  fetchAdminUsers.mockResolvedValue([
    { id: '1', email: 'a@example.com', username: 'Alice', role: 'staff' }
  ]);
  revokeAdminUser.mockResolvedValue({ success: true });

  await renderAdminUsers();

  const btn = document.querySelector('.revokeBtn');
  btn.click();

  expect(revokeAdminUser).toHaveBeenCalledWith('1');
});

test('calls updateUserRole on dropdown change', async () => {
  window.confirm = jest.fn(() => true); // Simulate confirmation
  fetchAdminUsers.mockResolvedValue([
    { id: '1', email: 'a@example.com', username: 'Alice', role: 'staff' }
  ]);
  updateUserRole.mockResolvedValue({ role: 'Resident' });

  await renderAdminUsers();

  const dropdown = document.querySelector('.roleSelector');
  dropdown.value = 'Resident';
  dropdown.dispatchEvent(new Event('change'));

  expect(updateUserRole).toHaveBeenCalledWith('1', 'Resident');
});
