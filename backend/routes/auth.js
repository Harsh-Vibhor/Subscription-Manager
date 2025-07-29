const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

const router = express.Router();

// Generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }
    
    const connection = getConnection();
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        error: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName]
    );
    
    // Generate token
    const token = generateToken({
      id: result.insertId,
      email,
      type: 'user'
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    const connection = getConnection();
    
    // Find user
    const [users] = await connection.execute(
      'SELECT id, email, password, first_name, last_name, is_active FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    const user = users[0];
    
    if (!user.is_active) {
      return res.status(401).json({ 
        error: 'Account is deactivated' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }
    
    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      type: 'user'
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    const connection = getConnection();
    
    // Find admin
    const [admins] = await connection.execute(
      'SELECT id, email, password, name, is_active FROM admins WHERE email = ?',
      [email]
    );
    
    if (admins.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid admin credentials' 
      });
    }
    
    const admin = admins[0];
    
    if (!admin.is_active) {
      return res.status(401).json({ 
        error: 'Admin account is deactivated' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid admin credentials' 
      });
    }
    
    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      type: 'admin'
    });
    
    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
    
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

module.exports = router;
