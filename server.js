const express = require('express');
const cors = require('cors'); // 👉 import cors
const db = require('./firebase');

const app = express();

// 👉 allow cross-origin requests
app.use(cors());
app.use(express.json());

app.post('/add-message', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.collection('messages').add({
      name,
      email,
      message,
      timestamp: new Date(),
    });
    res.status(200).send('Message stored successfully!');
  } catch (err) {
    console.error('Error writing to Firestore:', err);
    res.status(500).send('Something went wrong.');
  }
});

app.listen(3000, () => {
  console.log('🔥 Server running at http://localhost:3000');
});


