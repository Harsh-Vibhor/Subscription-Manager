const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  database: process.env.DB_NAME || 'subscriptionmanager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and tables
async function initializeDatabase() {
  let connection;
  
  try {
    // First, connect without specifying database to create it if it doesn't exist
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'subscriptionmanager'}\``);
    console.log('Database created or already exists');
    
    // Close the initial connection and create a new one with the database specified
    await connection.end();

    // Create a new connection with the database
    connection = await mysql.createConnection({
      ...dbConfig,
      database: process.env.DB_NAME || 'subscriptionmanager'
    });

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);
    
    // Create admins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      )
    `);

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#1565c0',
        icon VARCHAR(50) DEFAULT '📋',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      )
    `);

    // Create subscriptions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category_id INT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cost DECIMAL(10, 2) NOT NULL,
        billing_cycle ENUM('monthly', 'yearly', 'weekly', 'daily') DEFAULT 'monthly',
        next_billing_date DATE NOT NULL,
        website_url VARCHAR(500),
        cancel_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_category_id (category_id),
        INDEX idx_next_billing_date (next_billing_date)
      )
    `);

    // Create notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subscription_id INT,
        type ENUM('renewal_reminder', 'payment_due', 'system_alert') DEFAULT 'renewal_reminder',
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        scheduled_for TIMESTAMP NULL,
        sent_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_scheduled_for (scheduled_for),
        INDEX idx_is_read (is_read)
      )
    `);
    
    // Create default admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@subscriptionmanager.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM admins WHERE email = ?',
      [adminEmail]
    );
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await connection.execute(
        'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
        [adminEmail, hashedPassword, 'System Administrator']
      );
      console.log('Default admin user created');
    }

    // Create default categories if they don't exist
    const [existingCategories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    if (existingCategories[0].count === 0) {
      const defaultCategories = [
        { name: 'Movies & TV', description: 'Streaming services and entertainment', color: '#e91e63', icon: '🎬' },
        { name: 'Networking', description: 'Professional networking and business tools', color: '#2196f3', icon: '🌐' },
        { name: 'K-Drama', description: 'Korean drama streaming services', color: '#ff9800', icon: '🎭' },
        { name: 'Music', description: 'Music streaming and audio services', color: '#9c27b0', icon: '🎵' },
        { name: 'Software', description: 'Software subscriptions and tools', color: '#607d8b', icon: '💻' },
        { name: 'News & Media', description: 'News publications and media subscriptions', color: '#795548', icon: '📰' },
        { name: 'Fitness & Health', description: 'Health and fitness applications', color: '#4caf50', icon: '💪' },
        { name: 'Education', description: 'Learning platforms and educational content', color: '#ff5722', icon: '📚' },
        { name: 'Gaming', description: 'Gaming subscriptions and platforms', color: '#3f51b5', icon: '🎮' },
        { name: 'Other', description: 'Miscellaneous subscriptions', color: '#9e9e9e', icon: '📋' }
      ];

      for (const category of defaultCategories) {
        await connection.execute(
          'INSERT INTO categories (name, description, color, icon) VALUES (?, ?, ?, ?)',
          [category.name, category.description, category.color, category.icon]
        );
      }
      console.log('Default categories created');
    }

    console.log('Database tables initialized successfully');
    
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get database connection from pool
function getConnection() {
  return pool;
}

module.exports = {
  initializeDatabase,
  getConnection,
  pool
};
