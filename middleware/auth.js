import admin from 'firebase-admin';

export const verifyToken = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = global.mockedUser || {
      uid: 'test-user',
      email: 'test@example.com',
      role: 'Resident',
    };
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
