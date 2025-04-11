// <!-- Firebase Auth SDK -->

//   <script>
//     // document.getElementById('contactForm').addEventListener('submit', (e) => {
//     //   e.preventDefault();
  
//     //   const name = document.getElementById('name').value;
//     //   const email = document.getElementById('email').value;
//     //   const message = document.getElementById('message').value;
  
//     //   fetch('http://localhost:3000/add-message', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json'
//     //     },
//     //     body: JSON.stringify({ name, email, message })
//     //   })
//     //   .then(response => response.text())
//     //   .then(data => alert(data))
//     //   .catch(error => console.error('Error:', error));
//     // });



//   </script> 
//verification.js
const provider = new firebase.auth.GoogleAuthProvider();
const db=firebase.firestore();

document.getElementById('googleSignIn').addEventListener('click', () => {
      firebase.auth().signInWithPopup(provider)
        .then(async(result) => {
          const user = result.user;
          console.log("User info:", user);
          const userRef = db.collection("users").doc(user.uid);
          const docSnap = await userRef.get();
          
      if (!docSnap.exists) {
        await userRef.set({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
        console.log("User saved to Firestore.");
      } else {
        console.log("User already exists in Firestore.");
      }
          
          alert(`Signed in as ${user.displayName} (${user.email})`);
          window.location.href='homepage.html';
        })
        .catch((error) => {
          console.error("Google Sign-In Error:", error);
          alert("Sign-in failed. See console for details.");
        });
    });
