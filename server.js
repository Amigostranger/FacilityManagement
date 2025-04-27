import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('Server is starting');

let getIt=null;
const serviceAccountPath = path.resolve('./serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`serviceAccountKey.json not found at ${serviceAccountPath}`);
  process.exit(1);
}

// Read and parse the service account key
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
import { fileURLToPath } from 'url';

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define CORS options
// Define CORS options
const corsOptions = {
  origin: [
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501'
  ],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors());

app.use(express.static(path.join(__dirname, 'public'))); // 

// Handle preflight requests globally
//app.options('*', cors(corsOptions));

app.use(express.json());
app.use(bodyParser.json());

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    getIt=token;
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

app.get("/api/issues", verifyToken,async (req, res) => {
  const uid = req.user.uid; 
  try {
    const snapshot = await db.collection("Issues").where("submittedBy", "==", uid).get();
    
    
    const issues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ error: "Failed to get issues" });
  }
});




app.post("/api/save-user", verifyToken, async (req, res) => {
  const { email, username ,role} = req.body;
  console.log("Decoded user:", req.user);
  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    await userRef.set({
      email,
      username,
      role,
    });

    res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});


app.get('/api/get-users',async (req,res)=>{


  try {
    const getIt=await db.collection("users").get();
    const users = getIt.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    
  }
})

app.get("/api/staff-bookings",async (req,res) => {
  
  try {
    const getIt=await db.collection("bookings").get();
    const bookings=getIt.docs.map(doc =>({
      ...doc.data()
    }))
    res.status(200).send(bookings);

  } catch (error) {
    console.error(error);
  }
})

app.delete('/api/user/:id',async (req,res)=>{
  try {
    const userId=req.params.id;
   

    const user=db.collection('users').doc(userId);
    await user.delete();

    res.status(200).json({ 
      success: true,
      message: `User ${userId} deleted successfully`,
      deletedUserId: userId
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      error: "Failed to delete user",
      details: error.message 
    });
    //res.status(200).json({ message: `User ${userId} deleted successfully` });
  }
})




app.post("/api/report", verifyToken, async (req, res) => {
  const { title, description, facility } = req.body;
  const uid = req.user.uid; 

  if (!title || !description || !facility) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    await db.collection("Issues").add({
      title,
      description,
      facility,
      submittedBy: uid,
      status: "Pending",
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Report submitted" });
  } catch (error) {
    console.error("Report save error:", error);
    res.status(500).json({ error: "Failed to save report" });
  }
});

app.put('/api/user/:id',async (req,res)=>{
  try {
    
    const id=req.params.id;
    const { role, username, email } = req.body;
    const getIt=  db.collection("users").doc(id);


    if (role!=""){
      await getIt.update({
        role:role
      })
      res.status(200).json({ message: `User ${id} role updated to ${role}` });
    }

    else{
      res.status(400).json({ error: "Role cannot be empty" });
    }
    
  

  } catch (e) {
    console.error(e);
    
  }
})



app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register_page.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login_page.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'login_page.html'));
});

app.use(express.static(__dirname));

// Endpoint to get user from Firestore
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




// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

