import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();
const app = express();

// CORS Options
const corsOptions = {
  origin: '*', // Replace with your frontend URL in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

// Middleware Setup
app.use(cors(corsOptions)); 
app.options('*', cors(corsOptions)); // Preflight handling
app.use(bodyParser.json());

// Firebase Token Verification Middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;  // Attach user info to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Save User Endpoint
app.post("/api/save-user", verifyToken, async (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    await userRef.set({ email, username });
    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

// Get User Endpoint
app.post("/api/get-user", async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split("Bearer ")[1];  // Extract token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Authorization header missing or token invalid" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token); // Verify the token
    const uid = decodedToken.uid;
    const userDoc = await db.collection("users").doc(uid).get(); // Fetch user data from Firestore

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found. Please create an account!" });
    }

    res.status(200).json(userDoc.data());  // Send the user data as JSON
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// Error Handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Start Server (only in local dev)
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Azure Static Web Apps
export default app;
