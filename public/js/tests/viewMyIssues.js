async function viewMyIssues(db, uid) {
    try {
      if (!uid) {
        return { status: 401, body: { error: "Unauthorized" } };
      }
  
      const snapshot = await db.collection("Issues").where("submittedBy", "==", uid).get();
  
      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return { status: 200, body: { issues } };
    } catch (error) {
      console.error("Error fetching issues:", error);
      return { status: 500, body: { error: "Failed to get issues" } };
    }
  }
  
  module.exports = viewMyIssues;
  