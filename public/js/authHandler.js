// public/js/authHandler.js
export async function loginWithEmail(auth, email, password, getUserData) {
    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
  
    const response = await getUserData(token);
    const data = await response.json();
  
    if (!response.ok) throw new Error(data.error || 'Failed to fetch user');
  
    return { username: data.username, role: data.role };
  }
  