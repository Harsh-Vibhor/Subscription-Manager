const express = require('express');
const { getConnection } = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get system statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Get user count
    const [userCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM users WHERE is_active = TRUE'
    );
    
    // Get subscription count
    const [subscriptionCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM subscriptions WHERE is_active = TRUE'
    );
    
    // Get total revenue (monthly equivalent)
    const [totalRevenue] = await connection.execute(`
      SELECT SUM(CASE 
        WHEN billing_cycle = 'monthly' THEN cost
        WHEN billing_cycle = 'yearly' THEN cost / 12
        WHEN billing_cycle = 'weekly' THEN cost * 4.33
        WHEN billing_cycle = 'daily' THEN cost * 30
        ELSE cost
      END) as total_monthly_revenue
      FROM subscriptions WHERE is_active = TRUE
    `);
    
    // Get category distribution
    const [categoryStats] = await connection.execute(`
      SELECT c.name, c.color, COUNT(s.id) as subscription_count
      FROM categories c
      LEFT JOIN subscriptions s ON c.id = s.category_id AND s.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id, c.name, c.color
      ORDER BY subscription_count DESC
    `);

    res.json({
      userCount: userCount[0].count,
      subscriptionCount: subscriptionCount[0].count,
      totalMonthlyRevenue: totalRevenue[0].total_monthly_revenue || 0,
      categoryStats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    const [users] = await connection.execute(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.is_active, u.created_at,
        COUNT(s.id) as subscription_count,
        SUM(CASE 
          WHEN s.billing_cycle = 'monthly' THEN s.cost
          WHEN s.billing_cycle = 'yearly' THEN s.cost / 12
          WHEN s.billing_cycle = 'weekly' THEN s.cost * 4.33
          WHEN s.billing_cycle = 'daily' THEN s.cost * 30
          ELSE s.cost
        END) as monthly_spending
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.is_active = TRUE
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details
router.get('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Get user info
    const [users] = await connection.execute(
      'SELECT id, email, first_name, last_name, is_active, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's subscriptions
    const [subscriptions] = await connection.execute(`
      SELECT s.*, c.name as category_name, c.color as category_color
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.user_id = ? AND s.is_active = TRUE
      ORDER BY s.next_billing_date ASC
    `, [req.params.id]);

    res.json({
      user: users[0],
      subscriptions
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Toggle user active status
router.put('/users/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      'UPDATE users SET is_active = NOT is_active WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user status
    const [users] = await connection.execute(
      'SELECT is_active FROM users WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'User status updated successfully',
      isActive: users[0].is_active
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get all categories (admin view)
router.get('/categories', authenticateAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    const [categories] = await connection.execute(`
      SELECT c.*, COUNT(s.id) as subscription_count
      FROM categories c
      LEFT JOIN subscriptions s ON c.id = s.category_id AND s.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    res.json({ categories });
  } catch (error) {
    console.error('Get admin categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new category
router.post('/categories', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const connection = getConnection();
    const [result] = await connection.execute(
      'INSERT INTO categories (name, description, color, icon) VALUES (?, ?, ?, ?)',
      [name, description || null, color || '#1565c0', icon || '📋']
    );

    res.status(201).json({
      message: 'Category created successfully',
      categoryId: result.insertId
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const connection = getConnection();
    const [result] = await connection.execute(`
      UPDATE categories SET
        name = COALESCE(?, name),
        description = ?,
        color = COALESCE(?, color),
        icon = COALESCE(?, icon),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, color, icon, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Toggle category active status
router.put('/categories/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      'UPDATE categories SET is_active = NOT is_active WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category status updated successfully' });
  } catch (error) {
    console.error('Toggle category status error:', error);
    res.status(500).json({ error: 'Failed to update category status' });
  }
});

module.exports = router;
