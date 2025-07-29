const express = require('express');
const { getConnection } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all notifications for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    const [notifications] = await connection.execute(`
      SELECT n.*, s.name as subscription_name
      FROM notifications n
      LEFT JOIN subscriptions s ON n.subscription_id = s.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [req.user.id]);

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    await connection.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Get unread notification count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.user.id]
    );

    res.json({ unreadCount: result[0].count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Create notification (for system use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { subscription_id, type, title, message, scheduled_for } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const connection = getConnection();
    const [result] = await connection.execute(`
      INSERT INTO notifications (user_id, subscription_id, type, title, message, scheduled_for)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [req.user.id, subscription_id || null, type || 'system_alert', title, message, scheduled_for || null]);

    res.status(201).json({
      message: 'Notification created successfully',
      notificationId: result.insertId
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

module.exports = router;
