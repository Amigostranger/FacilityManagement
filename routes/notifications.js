import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js'

const createNotificationsRouter = (db, admin) => {

  const router = express.Router();

  //API Endpoint for Reading a notification
  router.post("/api/read", verifyToken(admin.auth()), async (req, res) => {
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

  //API Endpoint for Listing notifications
  router.get("/api/count-read", verifyToken(admin.auth()),async (req, res) => {
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
  router.get("/api/notifications", verifyToken(admin.auth()),async (req, res) => {
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

  return router;

};

export default createNotificationsRouter;
