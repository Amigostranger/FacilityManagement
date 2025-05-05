/**
 * @jest-environment jsdom
 */
const { loadUsers, talkToit } = require('./list_users');

global.fetch = jest.fn();

describe('talkToit', () => {
  let event;

  beforeEach(() => {
    global.confirm = jest.fn(() => true); // Simulate clicking OK

    global.usersarr = [
      { id: '123', name: 'Alice', role: 'viewer' },
    ];

    jest.spyOn(require('./list_users'), 'loadUsers').mockImplementation(() => {}); // Stub loadUsers
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    event = {
      target: {
        value: 'admin',
        getAttribute: () => '123',
      }
    };
  });

  test('calls fetch and updates user role', async () => {
    await talkToit(event);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/123'),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
      })
    );

    expect(usersarr[0].role).toBe('admin');
    expect(loadUsers).toHaveBeenCalled();
  });

  test('does nothing if role is empty', async () => {
    event.target.value = '';
    await talkToit(event);

    expect(fetch).not.toHaveBeenCalled();
  });

  test('does nothing if user cancels confirm dialog', async () => {
    global.confirm = jest.fn(() => false);
    await talkToit(event);

    expect(fetch).not.toHaveBeenCalled();
  });
});
