-- Database setup script with intentional issues

-- ERROR 33: No database existence check
CREATE DATABASE testdb;
USE testdb;

-- ERROR 34: Weak table structure and missing constraints
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),  -- ERROR 35: No UNIQUE constraint
    email VARCHAR(100),    -- ERROR 36: No UNIQUE constraint  
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- ERROR 37: Missing indexes for performance
    -- ERROR 38: No foreign key constraints
    -- ERROR 39: No data validation constraints
);

-- Insert some test data with weak passwords for testing
-- ERROR 40: Passwords stored in plain text in this script (for demo purposes)
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', '$2a$08$mBZ9f8qwegQh9TjZ9BhLZe6FoR8L2xH7ZjL9q3CxV8l5QnA2B3D4F'),
('testuser', 'test@example.com', '$2a$08$n7G8h4fwegQi8TjA8ChMbe6FoR8L2xH7ZjL9q3CxV8l5QnA2B3D4G'),
('demo', 'demo@example.com', '$2a$08$k5H6g2ewegQj7TjB7DhNce6FoR8L2xH7ZjL9q3CxV8l5QnA2B3D4H');

-- ERROR 41: No user roles or permissions table
-- ERROR 42: No audit log table for tracking changes
-- ERROR 43: No proper backup strategy mentioned
