
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".googleSignIn");

  btn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      const token = await user.getIdToken();
      console.log('Token:', token);

      // Send token to backend
      const response = await fetch("http://localhost:3000/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log("✅ Server response:", data);
      
    } catch (err) {
      console.error("❌ Error during sign-in:", err);
    }
  });
});