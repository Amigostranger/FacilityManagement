const express = require('express');
const cors = require('cors');
const { db, admin } = require('./firebase'); //grab initialized admin here
const app = express();

app.use(cors());
app.use(express.json());



app.post('/api/authenticate', async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name;
    const photoURL = decodedToken.picture;

    const userRef=db.collection('users').doc(uid);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      // await userRef.set({
      //   uid,
      //   email,
      //   name,
      //   photoURL,
      //   createdAt: new Date().toISOString(),
      // });
      // console.log("User saved to Firestore.");
      
    } else {
      console.log("User already exists.");
    }

    // Perform actions like fetching or storing data based on user
    res.status(200).send({ message: 'User authentication successful', uid });
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized', error });
  }
});







app.listen(3000, () => console.log('Server running on port 3000'));


// app.post('/add-message', async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     await db.collection('messages').add({
//       name,
//       email,
//       message,
//       timestamp: new Date(),
//     });
//     res.status(200).send('Message stored successfully!');
//   } catch (err) {
//     console.error('Error writing to Firestore:', err);
//     res.status(500).send('Something went wrong.');
//   }
// });


