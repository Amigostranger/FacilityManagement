import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

console.log('Server is starting')
dotenv.config();

// Import service account key dynamically
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('./serviceAccountKey.json'), 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();

// CORS middleware to allow specific origin (or all origins)
// app.use(cors({
//   origin: 'http://127.0.0.1:5501', // Allow requests from your front-end
// }));
// s
// 

 // Handle preflight requests globally
app.options('*', cors(corsOptions));


app.use(express.json());
app.use(bodyParser.json());

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Endpoint to save user to Firestore
app.post("/api/save-user", verifyToken, async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    await userRef.set({
      email,
      username,
    });

    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});



app.post("/api/get-user", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: "Create an Account!" });
    }

    const userData = userDoc.data();
    res.status(200).send(userData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// setInterval(() => {
//   console.log('Server is alive...');
// }, 5000);
