const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccountKey.json')),
  });
}

const db = admin.firestore();

module.exports = async function (context, req) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    context.res = { status: 401, body: { error: 'No token provided' } };
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      context.res = { status: 404, body: { error: 'User not found' } };
      return;
    }

    const userData = userDoc.data();
    context.res = { status: 200, body: userData };
  } catch (error) {
    console.error('Error:', error);
    context.res = { status: 500, body: { error: 'Server error', details: error.message } };
  }
};
