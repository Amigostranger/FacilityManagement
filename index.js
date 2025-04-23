// index.js
import app from './server.js';  // Import the app created in server.js

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});