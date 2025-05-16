import express from 'express';

import { verifyToken } from '../middleware/verifyToken.js'

const createIssuesRouter =  (db, admin) => {

const router = express.Router();

  router.get("/api/issues", verifyToken(admin.auth()),async (req, res) => {
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

  router.post("/api/report", verifyToken(admin.auth()), async (req, res) => {
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
    
  return router

};
export default createIssuesRouter;