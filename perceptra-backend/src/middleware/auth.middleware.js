// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// ---------------------------------------------------------------------------
// JWT auth middleware — protects routes that require a logged-in operator.
// Attach to any route that should not be publicly accessible.
// Usage: router.get('/protected', protect, controller)
// ---------------------------------------------------------------------------

export function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------------------------------------------------------------------------
// Role-based access — use after protect middleware.
// Usage: router.delete('/persons/:id', protect, requireRole('ADMIN'), controller)
// ---------------------------------------------------------------------------

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied — requires role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
}