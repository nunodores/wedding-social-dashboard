-- Wedding Events Platform - Additional Tables Only
-- Database: wedding-apps
-- Only creating tables that don't exist in your current schema

USE wedding_apps;

-- Users table (for admins and couples) - NEW TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'couple') NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table (different from your wedding_events table) - NEW TABLE
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_code VARCHAR(20) UNIQUE NOT NULL,
    couple_user_id INT NOT NULL,
    event_date DATE,
    description TEXT,
    primary_color VARCHAR(7) DEFAULT '#d946ef',
    logo_url VARCHAR(500),
    status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (couple_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Update your existing guests table to work with the new events table
-- Add event_id column if it doesn't exist (to link to the new events table)
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS event_id INT,
ADD COLUMN IF NOT EXISTS status ENUM('invited', 'confirmed', 'declined') DEFAULT 'invited' AFTER password_hash;

-- Add foreign key constraint for event_id if it doesn't exist
-- Note: You may need to populate this column first before adding the constraint
-- ALTER TABLE guests ADD FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- Payments table (for Stripe integration) - NEW TABLE
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Update your existing posts table to work with the new events table
-- Add event_id column if it doesn't exist
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS event_id INT AFTER guest_id;

-- Add foreign key constraint for event_id if it doesn't exist
-- ALTER TABLE posts ADD FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- Create indexes for better performance on new tables
CREATE INDEX IF NOT EXISTS idx_events_code ON events(event_code);
CREATE INDEX IF NOT EXISTS idx_events_couple ON events(couple_user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event ON payments(event_id);

-- Create indexes for the modified existing tables
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_posts_event_id ON posts(event_id);

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, role, name) VALUES 
('admin@weddingplatform.com', '$2a$10$rQJ5YSV1hiZA7jVRsKzuAO7p7nFm6FBZjKoY5Xw3.9Z4vB7xHQKW2', 'admin', 'Platform Admin')
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role = VALUES(role),
    name = VALUES(name);

-- Show what we created
SELECT 'New tables created:' as info;
SHOW TABLES LIKE 'users';
SHOW TABLES LIKE 'events';
SHOW TABLES LIKE 'payments';

-- Show admin user
SELECT 'Admin user:' as info;
SELECT id, email, role, name, created_at FROM users WHERE role = 'admin';

-- Show existing tables that we're keeping
SELECT 'Existing tables kept:' as info;
SHOW TABLES LIKE 'wedding_events';
SHOW TABLES LIKE 'guests';
SHOW TABLES LIKE 'posts';
SHOW TABLES LIKE 'stories';
SHOW TABLES LIKE 'comments';
SHOW TABLES LIKE 'likes';
SHOW TABLES LIKE 'notifications';