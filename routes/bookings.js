import express from 'express';

import { verifyToken } from '../middleware/verifyToken.js'




const router = express.Router();

router.post("/api/createEvent", verifyToken,async (req,res) => {
  const {title, description, facility, start, end, who}=req.body 
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
          start,
          end,
          read: "false"
        });
      }

    const newStart = admin.firestore.Timestamp.fromDate(new Date(start));
    const newEnd = admin.firestore.Timestamp.fromDate(new Date(end));




    const overlapping = await db.collection("bookings")
      .where("facility", "==", facility)
      .where("status", "==","Approved")
      .where("start", "<", newEnd)
      .where("end", ">", newStart)
      .get();

    if (!overlapping.empty) {
      return res.status(409).json({ error: "Event conflict detected" });
    }


    await db.collection("bookings").add({
      title,
      description,
      facility,
      submittedBy: uid,
      //date,
      status:"Approved",
      start:newStart,
      end:newEnd,
      who,
      //createdAt: new Date(),
    });

    res.status(200).json({ message: "Report submitted" });
  }
  catch{
    console.error("Report save error:", error);
    res.status(500).json({ error: "Failed to save event" });
}

});

router.get("/api/staff-bookings",async (req,res) => {
  
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

router.post("/api/bookings", verifyToken, async (req, res) => {
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

router.put('/api/booking-status/:id',async (req,res)=>{
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


export default router;