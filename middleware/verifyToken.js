export const verifyToken = (auth) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

