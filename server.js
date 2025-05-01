import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

console.log('Server is starting');
// Initialize Firebase Admin
//const serviceAccountPath = path.resolve('./serviceAccountKey.json');

// if (!fs.existsSync(serviceAccountPath)) {
//   console.error(`serviceAccountKey.json not found at ${serviceAccountPath}`);
//   process.exit(1);
// }

//const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const auth = admin.auth();

// Express setup
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration
const whitelist = [
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501',
  'https://your-production-domain.com'
];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5500',  // VS Code Live Server default
      'http://127.0.0.1:5500',  // Alternative localhost
      'http://localhost:3000',   // Your React/Vite dev server
      'https://your-production-domain.com' // Add your production domain later
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// MIDDLEWARE
// ======================

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authorization token required' });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role // Ensure role is included in your Firebase custom claims
    };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: `Requires ${role} role` });
  }
  next();
};

// ======================
// ROUTES
// ======================

// User Management Endpoints
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const currentUserRole = req.user.role?.toLowerCase() || 'resident';
    const snapshot = await db.collection('users').get();
    
    const filteredUsers = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => {
        if (user.id === req.user.uid) return false;
        
        switch(currentUserRole) {
          case 'admin': return user.role?.toLowerCase() !== 'admin';
          case 'staff': return user.role?.toLowerCase() === 'resident';
          default: return false;
        }
      });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/users/:id/role', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) return res.status(400).json({ error: 'Role is required' });
    
    await db.collection('users').doc(id).update({ role });
    
    // Update custom claims if needed
    try {
      await auth.setCustomUserClaims(id, { role });
    } catch (authError) {
      console.warn('Failed to update custom claims:', authError);
    }
    
    res.status(200).json({ message: `Role updated to ${role}` });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Resident-specific Endpoints
app.get('/api/residents', verifyToken, requireRole('staff'), async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'resident')
      .get();
    
    const residents = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      lastActive: doc.data().lastActive || null
    }));
    
    res.status(200).json(residents);
  } catch (error) {
    console.error('Get residents error:', error);
    res.status(500).json({ error: 'Failed to fetch residents' });
  }
});

// Booking Management
app.get('/api/bookings', verifyToken, async (req, res) => {
  try {
    let query = db.collection('bookings');
    
    // Staff only see their own bookings
    if (req.user.role === 'staff') {
      query = query.where('submittedBy', '==', req.user.uid);
    }
    
    const snapshot = await query.get();
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Issue Reporting
app.post('/api/issues', verifyToken, async (req, res) => {
  try {
    const { title, description, facility } = req.body;
    if (!title || !description || !facility) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newIssue = {
      title,
      description,
      facility,
      submittedBy: req.user.uid,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('issues').add(newIssue);
    res.status(201).json({ id: docRef.id, ...newIssue });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// ======================
// AUTHENTICATION ROUTES
// ======================

app.post('/api/get-user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token required' });

    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not registered' });
    }

    res.status(200).json({
      userId: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data()
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// ======================
// STATIC FILES
// ======================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login_page.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// ======================
// ERROR HANDLING
// ======================

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});