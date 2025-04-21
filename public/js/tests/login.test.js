/**
 * @jest-environment jsdom
 */
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../firebase'; // mock this
import '../login.js'; // assumes logic runs on import

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

global.fetch = jest.fn();
global.alert = jest.fn();

describe("Login functionality", () => {
  let emailInput, passwordInput, loginBtn, googleBtn, messageDiv, signupBtn;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="email" />
      <input id="password" />
      <button id="btnlog">Login</button>
      <button id="googleLoginBtn">Google</button>
      <div id="message"></div>
      <div id="sign-up"></div>
    `;

    emailInput = document.getElementById("email");
    passwordInput = document.getElementById("password");
    loginBtn = document.getElementById("btnlog");
    googleBtn = document.getElementById("googleLoginBtn");
    messageDiv = document.getElementById("message");
    signupBtn = document.getElementById("sign-up");
  });

  it("logs in with email/password successfully", async () => {
    emailInput.value = "test@example.com";
    passwordInput.value = "password123";

    const fakeToken = "fakeToken";
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue(fakeToken),
    };
    const mockUserCredential = { user: mockUser };

    signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: "Alice", role: "resident" }),
    });

    await loginBtn.click();

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "test@example.com", "password123");
    expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: `Bearer ${fakeToken}`,
      }),
    }));
    expect(messageDiv.textContent).toContain("Welcome, Alice! Role: resident");
  });

  it("shows error on failed login", async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error("Invalid login"));

    await loginBtn.click();

    expect(messageDiv.textContent).toContain("Login failed: Invalid login");
  });

  it("handles Google login success", async () => {
    const mockUser = { getIdToken: jest.fn().mockResolvedValue("googleToken") };
    signInWithPopup.mockResolvedValue({ user: mockUser });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: "Bob", role: "admin" }),
    });

    await googleBtn.click();

    expect(signInWithPopup).toHaveBeenCalled();
    expect(messageDiv.textContent).toContain("Welcome, Bob! Role: admin");
  });

  it("handles Google login failure", async () => {
    signInWithPopup.mockRejectedValue(new Error("Google error"));

    await googleBtn.click();

    expect(messageDiv.textContent).toContain("Google login failed: Google error");
  });
});
