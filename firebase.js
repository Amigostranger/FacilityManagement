
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 👈 Make sure this path matches the file name

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;
