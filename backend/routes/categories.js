const express = require('express');
const { getConnection } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    const [categories] = await connection.execute(`
      SELECT c.*, 
        COUNT(s.id) as subscription_count,
        SUM(CASE 
          WHEN s.billing_cycle = 'monthly' THEN s.cost
          WHEN s.billing_cycle = 'yearly' THEN s.cost / 12
          WHEN s.billing_cycle = 'weekly' THEN s.cost * 4.33
          WHEN s.billing_cycle = 'daily' THEN s.cost * 30
          ELSE s.cost
        END) as monthly_cost
      FROM categories c
      LEFT JOIN subscriptions s ON c.id = s.category_id AND s.user_id = ? AND s.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name ASC
    `, [req.user.id]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID with subscriptions
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Get category info
    const [categories] = await connection.execute(
      'SELECT * FROM categories WHERE id = ? AND is_active = TRUE',
      [req.params.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get subscriptions in this category
    const [subscriptions] = await connection.execute(`
      SELECT * FROM subscriptions 
      WHERE category_id = ? AND user_id = ? AND is_active = TRUE
      ORDER BY next_billing_date ASC
    `, [req.params.id, req.user.id]);

    res.json({
      category: categories[0],
      subscriptions
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;
