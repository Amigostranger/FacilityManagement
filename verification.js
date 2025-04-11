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

const provider = new firebase.auth.GoogleAuthProvider();

document.getElementById('googleSignIn').addEventListener('click', () => {
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          console.log("User info:", user);
          console.log(user.displayName); // Name
console.log(user.email);       // Email
console.log(user.uid);         // Unique ID
console.log(user.photoURL);    // Profile picture
window.location.href = 'homepage.html';
//document.body.innerHTML += `<h2>Welcome, ${user.displayName}!</h2>`;

          alert(`Signed in as ${user.displayName} (${user.email})`);
        })
        .catch((error) => {
          console.error("Google Sign-In Error:", error);
          alert("Sign-in failed. See console for details.");
        });
    });
