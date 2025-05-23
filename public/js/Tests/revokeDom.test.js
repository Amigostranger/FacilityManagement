/**
 * @jest-environment jsdom
 */
import { renderUsers } from '../revokeDom.js';
import { revokeUser } from '../revokeFun.js';

jest.mock('../revokeFun.js', () => ({
  revokeUser: jest.fn()
}));

beforeEach(() => {
  document.body.innerHTML = `
    <table>
      <tbody id="userTableBody"></tbody>
    </table>
  `;
});

test('renders users excluding staff/admin', () => {
  const users = [
    { id: '1', email: 'a@example.com', role: 'resident' },
    { id: '2', email: 'b@example.com', role: 'admin' }
  ];

  renderUsers(users);

  const rows = document.querySelectorAll('tbody tr');
  expect(rows.length).toBe(1);
  expect(rows[0].innerHTML).toContain('a@example.com');
});

test('calls revokeUser on button click', () => {
  window.confirm = jest.fn(() => true); // Simulate confirmation
  revokeUser.mockResolvedValue({ success: true });

  const users = [{ id: '1', email: 'a@example.com', role: 'resident' }];
  renderUsers(users);

  const btn = document.querySelector('.deleteBtn');
  btn.click();

  expect(revokeUser).toHaveBeenCalledWith('1');
});
