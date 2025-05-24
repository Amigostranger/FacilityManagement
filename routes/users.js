import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js'
import cron from 'node-cron';
import fetch from 'node-fetch'; // or `import('node-fetch')` if ESM
const OPENWEATHER_API_KEY = 'ba2e8aa8a77b82b805ab1784816de5a8';
const LOCATION = {
  lat: -26.2041, // Johannesburg example
  lon: 28.0473,
};
let latestWeatherNotification = null; // In-memory storage

const createUserRoutes = (db, admin) => {

  const router = express.Router();

  router.put('/api/user-revoke/:id',async (req,res)=>{

    const userID=req.params.id;
    const {status}=req.body;
    // const user=db.collection('users').doc(userID);
    // if(!user.exists){
    //   return res.status(404).json({ error: "user not found" });
    // }

    // if(user.status!=status){
    //   await doc(userID).update({status:"revoked"});
    // }

    try {
      
      const userRef = db.collection('users').doc(userID);
      const userSnap = await userRef.get();
      //const currentStatus = userSnap.data().status;
      if (!userSnap.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      const currentStatus = userSnap.data().status;

      if (currentStatus !== status) {
        await userRef.update({ status: "revoked" });
      }

      return res.status(200).json({ message: "User status updated if needed" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }


  });

  router.post("/api/save-user", verifyToken(admin.auth()), async (req, res) => {

    const { username ,role,status} = req.body;
    console.log("Decoded user:", req.user);
    
    // console.log("Decoded user:", req.user);

    if (!username) {
      return res.status(400).json({ error: "Username are required" });
    }

    try {

      const userRef = db.collection("users").doc(req.user.uid);
      await userRef.set({
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
          start: new Date(booking.start).toISOString(),
          end: new Date(booking.end).toISOString(),
          read: "false",
          createdAt: booking.createdAt
        });
        
      }
      res.status(200).json({ message: "User saved successfully" });

    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      res.status(500).json({ error: "Failed to save user" });
    }
  });

  router.get('/api/get-users',async (req,res)=>{

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

  router.delete('/api/user/:id',async (req,res)=>{
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


  router.get('/api/user/:id',async (req,res)=>{
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

  router.post("/api/check-users",async (req,res)=>{
    

  try {
    const {username}=req.body;
    const getIt=await db.collection("users").where("username","==",username).get()//remember 
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

  router.put('/api/user/:id',async (req,res)=>{
    try {
      
      const id=req.params.id;
      const { role, username } = req.body;
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

  router.post("/api/get-user", async (req, res) => {
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

  router.get("/api/activeUsers",async (req,res) => {
    
    try {
      const getIssues=await db.collection("Issues").get();
      const issues=getIssues.docs.map(doc =>({
        bookId:doc.id,
        ...doc.data()
      }))

      const usersSnapshot = await db.collection("users").get();
      const totalUsers = usersSnapshot.docs.length; 

      const now = new Date();

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - 7 - today.getDay() + 1);

      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1); // 1st of last month
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month


      // Convert Firestore timestamp and filter
      const lastWeekIssues = issues.filter(issue => {
        const createdAt = issue.createdAt?.seconds 
          ? new Date(issue.createdAt.seconds * 1000) 
          : new Date(issue.createdAt._seconds * 1000);
        
        return createdAt >= lastWeekStart && createdAt <= lastWeekEnd;
      });

      const lastMonthIssues = issues.filter(issue => {
        const createdAt = issue.createdAt?.seconds 
          ? new Date(issue.createdAt.seconds * 1000) 
          : new Date(issue.createdAt._seconds * 1000);
        
        return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
      });

      // lastWeekIssues.forEach(issue=>{
      //   let currentIssue=issue.submittedBy;
      //   lastWeekEnd.forEach(i=>{
      //     if(currentIssue=issue);
      //   })
      // })

      res.status(200).send({
              lastWeek: lastWeekIssues.length,
              lastMonth: lastMonthIssues.length,
              totalUsers:totalUsers
          });

    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  });


  cron.schedule('01 00 * * *', async () => {
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${LOCATION.lat}&lon=${LOCATION.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const forecast = data.daily;

    if (!forecast || forecast.length < 6) {
      console.error('Not enough forecast data');
      return;
    }

    const target = forecast[0]; // Today + 5 days
    latestWeatherNotification = {
      date: new Date(target.dt * 1000).toDateString(),
      condition: target.weather[0].main,
      description: target.weather[0].description,
      temp: {
        min: target.temp.min,
        max: target.temp.max,
      },
      icon: `https://openweathermap.org/img/wn/${target.weather[0].icon}@2x.png`,
    };

    console.log('Updated weather notification:', latestWeatherNotification);
  } catch (err) {
    console.error('Scheduled weather fetch failed:', err);
  }
});

router.get('/api/weather', (req, res) => {
  if (latestWeatherNotification) {
    res.json(latestWeatherNotification);
  } else {
    res.status(503).json({ error: 'Weather notification not ready yet' });
  }
});


    return router;
};

export default createUserRoutes;
