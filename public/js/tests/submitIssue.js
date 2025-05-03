async function submitIssue(db, uid, title, description, facility) {
    if (!uid) {
      return { status: 401, body: { error: "Unauthorized" } };
    }
  
    if (!title || !description || !facility) {
      return { status: 400, body: { error: "All fields required" } };
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
  
      return { status: 200, body: { message: "Report submitted" } };
    } catch (error) {
      console.error("Report save error:", error);
      return { status: 500, body: { error: "Failed to save report" } };
    }
  }
  
  module.exports = submitIssue;
  