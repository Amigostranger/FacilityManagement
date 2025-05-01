// checkUserStatus.js
const checkUserStatus = async (db, email) => {
    const getIt = await db.collection("users").where("email", "==", email).get();
  
    if (getIt.empty) {
      return { status: 200, body: { error: "user not available" } };
    }
  
    let status = "Allowed";
    getIt.docs.forEach(doc => {
      const data = doc.data();
      if (data.status && data.status.toLowerCase() === "revoked") {
        status = "revoked";
      }
    });
  
    return { status: 200, body: { status } };
  };
  
  module.exports = checkUserStatus;
  