import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('Server is starting');




// const serviceAccountPath = path.resolve('./serviceAccountKey.json');


// if (!fs.existsSync(serviceAccountPath)) {
//   console.error(`serviceAccountKey.json not found at ${serviceAccountPath}`);
//   process.exit(1);
// }

//const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


// Initialize Firebase Admin SDK with the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();
const auth = admin.auth();

const app = express();
import { fileURLToPath } from 'url';
import { get } from 'https';

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

let getIt=null;
// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
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
//API Endpoint for Reading a notification
app.post("/api/read", verifyToken, async (req, res) => {
  const n_id = req.body.notification;
  try {
    const snapshot = await db.collection("notifications")
      .where("recipient", "==", req.user.uid)
      .where("id", "==", n_id).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Notification not found" });
    }

    for (const doc of snapshot.docs) {
      await doc.ref.update({ read: "true" });
    }

    res.status(200).json({ message: "Notification marked as read" });

  } catch (error) {
    console.error("Error reading the event details:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});
//API Endpoint for creating an event
app.post("/api/createEvent", verifyToken,async (req,res) => {
  const {title, description, facility, date, start, end, who}=req.body 
  const uid=req.user.uid;
  if (!title || !description || !facility || !start || !end || !who) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const snapShot=await db.collection("users").where("role","==","resident").get();

    const users= snapShot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (const user of users) {
      const docRef = db.collection("notifications").doc();
      const n_id=docRef.id;
      console.log(n_id);
      await docRef.set({
        id: n_id,
        recipient: user.id,
        title,
        description,
        facility,
        submittedBy: uid,
        date,
        start,
        end,
        read: "false"
      });
    }
  
    
    await db.collection("bookings").add({
      title,
      description,
      facility,
      submittedBy: uid,
      date,
      start,
      end,
      who,
    
    });

    res.status(200).json({ message: "Report submitted" });
  }
  catch{
    console.error("Report save error:", error);
    res.status(500).json({ error: "Failed to save event" });
}

});

//API Endpoint for Listing notifications
app.get("/api/count-read", verifyToken,async (req, res) => {
  const uid=req.user.uid;

  try {

    const snapshot = await db.collection("notifications").where("recipient", "==", uid).where("read", "==", "false").get();
    const countRead=snapshot.size;
    
    res.status(200).json({"countRead":countRead});
    // console.log("Counting successful");

  } catch (error) {
    console.error("Error counting read notification :", error);
    res.status(500).json({ error: "Failed to get Events" });
  }
});

//API Endpoint for Listing notifications
app.get("/api/notifications", verifyToken,async (req, res) => {
  const uid=req.user.uid;
  try {
    const snapshot = await db.collection("notifications").where("recipient", "==", uid).get();
    const events= snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({events});

  } catch (error) {
    console.error("Error fetching Events:", error);
    res.status(500).json({ error: "Failed to get Events" });
  }
});

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

  const { email, username ,role,status} = req.body;
  console.log("Decoded user:", req.user);
  
  // console.log("Decoded user:", req.user);

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  try {

    const userRef = db.collection("users").doc(req.user.uid);
    await userRef.set({
      email,
      username,
      role,
      status,
    });
    const snapshot = await db.collection("bookings").where("who","==","admin").get();
    const bookings= snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(req.user.uid);
    const userID=req.user.uid;
    for (const booking of bookings) {
      const docRef = db.collection("notifications").doc();
      const n_id=docRef.id;
      
      await docRef.set({
        id: n_id,
        recipient: userID,
        title:booking.title,
        description:booking.description,
        facility:booking.facility,
        submittedBy: booking.submittedBy,
        start:booking.start,
        end:booking.end,
        read: "false"
      });
      
    }
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
    const getIt=await db.collection("bookings").where("status","==","Pending").get();
    const bookings=getIt.docs.map(doc =>({
      bookId:doc.id,
      ...doc.data()
    }))
    //console.log(doc.data);

    res.status(200).send(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
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
   
  }
})


app.get('/api/user/:id',async (req,res)=>{
  try {
    const userId=req.params.id;
    const user=db.collection('users').doc(userId).get();
    res.status(200).json({ 
      userId: userId
    });
  } catch (error) {
    console.error(error);
    
  }
})



app.post("/api/check-users",async (req,res)=>{
  

 try {
  const {email}=req.body;
  const getIt=await db.collection("users").where("email","==",email).get()//remember 
  if(getIt.empty){
    return res.status(200).json({ error: "user not available" });
  }


  let status = "Allowed";
  getIt.docs.forEach(doc => {
    const data = doc.data();
    if (data.status && data.status.toLowerCase() === "revoked") {
      status = "revoked";
    }
  });
  return res.status(200).json({ status});

 } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
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

app.post("/api/bookings", verifyToken, async (req, res) => {
  const { title, description, facility, start, end, who } = req.body; // Add `who` to request body
  const uid = req.user.uid; 

  if (!title || !description || !facility || !start || !end || !who) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {

    const newStart = admin.firestore.Timestamp.fromDate(new Date(start));
    const newEnd = admin.firestore.Timestamp.fromDate(new Date(end));

    const overlapping = await db.collection("bookings")
      .where("facility", "==", facility)
      .where("status", "==","Approved")
      .where("start", "<", newEnd)
      .where("end", ">", newStart)
      .get();

    if (!overlapping.empty) {
      return res.status(409).json({ error: "Booking conflict detected" });
    }

    await db.collection("bookings").add({
      title,
      description,
      facility,
      submittedBy: uid,
      status: "Pending",
      start: newStart,
      end: newEnd,
      who,
    });

    res.status(200).json({ message: "Booking submitted" });
  } catch (error) {
    console.error("Booking save error:", error);
    res.status(500).json({ error: "Failed to save Booking" });
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

app.put('/api/booking-status/:id',async (req,res)=>{
  const bookId=req.params.id;

try {
  const {status}=req.body;
  const getIt=  db.collection("bookings").doc(bookId);
  if (status!=""){
    await getIt.update({
      status:status
    })
    res.status(200).json({ message: `booking ${bookId} role updated to ${status}` });
  }
} catch (error) {
  console.error(error);
  res.status(500).send("Server error");
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
    if(userData.status=="revoked"){
      //console.log(userData.status);
      
      return res.status(404).send({ error: "Account revoked!" });
    }

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
const PORT = process.env.PORT || 3000||5173;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

