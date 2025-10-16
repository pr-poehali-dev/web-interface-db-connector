-- Create users table for admin panel
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Insert test data
INSERT INTO users (username, email, role, status, created_at, last_login) VALUES
('admin', 'admin@example.com', 'admin', 'active', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 hour'),
('john_doe', 'john@example.com', 'user', 'active', NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days'),
('jane_smith', 'jane@example.com', 'moderator', 'active', NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 hours'),
('bob_wilson', 'bob@example.com', 'user', 'inactive', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days'),
('alice_brown', 'alice@example.com', 'user', 'active', NOW() - INTERVAL '10 days', NOW() - INTERVAL '1 day');

-- Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test logs
INSERT INTO activity_logs (user_id, action, details, ip_address, created_at) VALUES
(1, 'LOGIN', 'User logged in successfully', '192.168.1.100', NOW() - INTERVAL '1 hour'),
(2, 'UPDATE_PROFILE', 'Updated email address', '192.168.1.101', NOW() - INTERVAL '2 days'),
(3, 'MODERATE_CONTENT', 'Moderated content ID: 456', '192.168.1.102', NOW() - INTERVAL '5 hours'),
(1, 'CREATE_USER', 'Created new user: alice_brown', '192.168.1.100', NOW() - INTERVAL '10 days'),
(3, 'UPDATE_SETTINGS', 'Changed notification preferences', '192.168.1.102', NOW() - INTERVAL '1 day');