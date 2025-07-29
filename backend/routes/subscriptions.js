const express = require('express');
const { getConnection } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all subscriptions for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    const [subscriptions] = await connection.execute(`
      SELECT s.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.user_id = ? AND s.is_active = TRUE
      ORDER BY s.next_billing_date ASC
    `, [req.user.id]);

    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get subscription by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    const [subscriptions] = await connection.execute(`
      SELECT s.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = ? AND s.user_id = ? AND s.is_active = TRUE
    `, [req.params.id, req.user.id]);

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription: subscriptions[0] });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create new subscription
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      cost,
      billing_cycle,
      next_billing_date,
      category_id,
      website_url,
      cancel_url
    } = req.body;

    // Validation
    if (!name || !cost || !next_billing_date) {
      return res.status(400).json({
        error: 'Name, cost, and next billing date are required'
      });
    }

    if (cost <= 0) {
      return res.status(400).json({
        error: 'Cost must be greater than 0'
      });
    }

    const connection = getConnection();
    const [result] = await connection.execute(`
      INSERT INTO subscriptions (
        user_id, name, description, cost, billing_cycle, 
        next_billing_date, category_id, website_url, cancel_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      name,
      description || null,
      cost,
      billing_cycle || 'monthly',
      next_billing_date,
      category_id || null,
      website_url || null,
      cancel_url || null
    ]);

    // Get the created subscription with category info
    const [newSubscription] = await connection.execute(`
      SELECT s.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: newSubscription[0]
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update subscription
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      cost,
      billing_cycle,
      next_billing_date,
      category_id,
      website_url,
      cancel_url
    } = req.body;

    const connection = getConnection();
    
    // Check if subscription exists and belongs to user
    const [existing] = await connection.execute(
      'SELECT id FROM subscriptions WHERE id = ? AND user_id = ? AND is_active = TRUE',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update subscription
    await connection.execute(`
      UPDATE subscriptions SET
        name = COALESCE(?, name),
        description = ?,
        cost = COALESCE(?, cost),
        billing_cycle = COALESCE(?, billing_cycle),
        next_billing_date = COALESCE(?, next_billing_date),
        category_id = ?,
        website_url = ?,
        cancel_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [
      name,
      description,
      cost,
      billing_cycle,
      next_billing_date,
      category_id,
      website_url,
      cancel_url,
      req.params.id,
      req.user.id
    ]);

    // Get updated subscription
    const [updated] = await connection.execute(`
      SELECT s.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `, [req.params.id]);

    res.json({
      message: 'Subscription updated successfully',
      subscription: updated[0]
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Delete subscription (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      'UPDATE subscriptions SET is_active = FALSE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

// Get subscription analytics
router.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    
    // Get total monthly cost
    const [monthlyCost] = await connection.execute(`
      SELECT 
        SUM(CASE 
          WHEN billing_cycle = 'monthly' THEN cost
          WHEN billing_cycle = 'yearly' THEN cost / 12
          WHEN billing_cycle = 'weekly' THEN cost * 4.33
          WHEN billing_cycle = 'daily' THEN cost * 30
          ELSE cost
        END) as total_monthly_cost
      FROM subscriptions 
      WHERE user_id = ? AND is_active = TRUE
    `, [req.user.id]);

    // Get category breakdown
    const [categoryBreakdown] = await connection.execute(`
      SELECT 
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        COUNT(s.id) as subscription_count,
        SUM(CASE 
          WHEN s.billing_cycle = 'monthly' THEN s.cost
          WHEN s.billing_cycle = 'yearly' THEN s.cost / 12
          WHEN s.billing_cycle = 'weekly' THEN s.cost * 4.33
          WHEN s.billing_cycle = 'daily' THEN s.cost * 30
          ELSE s.cost
        END) as monthly_cost
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.user_id = ? AND s.is_active = TRUE
      GROUP BY s.category_id, c.name, c.color, c.icon
      ORDER BY monthly_cost DESC
    `, [req.user.id]);

    // Get upcoming renewals (next 30 days)
    const [upcomingRenewals] = await connection.execute(`
      SELECT s.*, c.name as category_name, c.color as category_color
      FROM subscriptions s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.user_id = ? AND s.is_active = TRUE 
        AND s.next_billing_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY s.next_billing_date ASC
    `, [req.user.id]);

    res.json({
      totalMonthlyCost: monthlyCost[0].total_monthly_cost || 0,
      categoryBreakdown,
      upcomingRenewals
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
