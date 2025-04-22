// public/js/tests/authHandler.test.js
const { loginWithEmail } = require('../authHandler');

jest.mock('https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js', () => ({
  signInWithEmailAndPassword: jest.fn(),
}), { virtual: true });

describe('loginWithEmail', () => {
  const mockSignIn = require('https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js').signInWithEmailAndPassword;

  beforeEach(() => {
    mockSignIn.mockReset();
  });

  it('should return user data on successful login', async () => {
    mockSignIn.mockResolvedValue({
      user: {
        getIdToken: () => Promise.resolve("mockToken")
      }
    });

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ username: "John", role: "resident" })
      })
    );

    const result = await loginWithEmail({}, "test@example.com", "password123", mockFetch);
    expect(result).toEqual({ username: "John", role: "resident" });
  });

  it('should throw error if fetch fails', async () => {
    mockSignIn.mockResolvedValue({
      user: {
        getIdToken: () => Promise.resolve("mockToken")
      }
    });

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "User not found" })
      })
    );

    await expect(
      loginWithEmail({}, "test@example.com", "password123", mockFetch)
    ).rejects.toThrow("User not found");
  });
});
