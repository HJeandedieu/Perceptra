// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import config from '../config/config.js';

// ---------------------------------------------------------------------------
// Auth controller — register and login for dashboard operators.
// ---------------------------------------------------------------------------

// ------------------------------------------------------------------
// POST /api/auth/register
// ------------------------------------------------------------------
export async function register(req, res) {
  const { name, email, password, role } = req.body;

  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role:     role || 'OPERATOR',
      },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });

  } catch (err) {
    console.error('[auth] Register error:', err.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

// ------------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------------
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (err) {
    console.error('[auth] Login error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
}

// ------------------------------------------------------------------
// GET /api/auth/me
// ------------------------------------------------------------------
export async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });

  } catch (err) {
    console.error('[auth] Me error:', err.message);
    return res.status(500).json({ error: 'Could not fetch user' });
  }
}

// ------------------------------------------------------------------
// Internal helper
// ------------------------------------------------------------------
function generateToken(user) {
  return jwt.sign(
    {
      id:    user.id,
      email: user.email,
      role:  user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}