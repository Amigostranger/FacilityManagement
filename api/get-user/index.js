const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

module.exports = async function (context, req) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      context.res = {
        status: 404,
        body: { error: "Create an Account!" },
      };
      return;
    }

    const userData = userDoc.data();
    context.res = {
      status: 200,
      body: userData,
    };
  } catch (error) {
    console.error("Login error:", error);
    context.res = {
      status: 401,
      body: { error: "Unauthorized" },
    };
  }
};
