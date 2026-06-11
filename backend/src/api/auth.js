// Auth routes and middleware
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock user database (replace with real DB later)
const users = [
  {
    id: 1,
    email: 'admin@perceptra.ai',
    password_hash: bcrypt.hashSync('password123', 10),
    role: 'admin'
  },
  {
    id: 2,
    email: 'operator@perceptra.ai',
    password_hash: bcrypt.hashSync('password123', 10),
    role: 'operator'
  }
];

// JWT middleware - authenticate user
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based middleware - require admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  res.json({
    token,
    role: user.role,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  // Invalidate token (in real app, add to blacklist)
  res.json({ message: 'Logged out successfully' });
});

// --- User CRUD Routes (Admin Only) ---

// Get all users
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  // Don't send password hash
  const safeUsers = users.map(u => ({ id: u.id, email: u.email, role: u.role, created_at: u.created_at }));
  res.json(safeUsers);
});

// Get single user
router.get('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password_hash, ...safeUser } = user;
  res.json(safeUser);
});

// Create user
router.post('/users', authenticateToken, requireAdmin, (req, res) => {
  const { email, password, role } = req.body;
  
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (role && !['admin', 'operator'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or operator' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password_hash: bcrypt.hashSync(password, 10),
    role: role || 'operator',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  users.push(newUser);

  const { password_hash: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// Update user
router.put('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { email, password, role } = req.body;
  
  if (role && !['admin', 'operator'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or operator' });
  }

  const updatedUser = {
    ...users[userIndex],
    email: email || users[userIndex].email,
    role: role || users[userIndex].role,
    updated_at: new Date().toISOString()
  };
  
  if (password) {
    updatedUser.password_hash = bcrypt.hashSync(password, 10);
  }

  users[userIndex] = updatedUser;
  const { password_hash: _, ...safeUser } = updatedUser;
  res.json(safeUser);
});

// Delete user
router.delete('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

export default router;
