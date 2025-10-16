-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test products
INSERT INTO products (name, description, price, stock, category) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with A17 Pro chip', 999.99, 150, 'Electronics'),
('MacBook Air M2', '13-inch laptop with Apple M2 chip', 1199.99, 75, 'Electronics'),
('Sony WH-1000XM5', 'Premium noise-cancelling headphones', 399.99, 200, 'Audio'),
('Samsung Galaxy S24', 'Flagship Android smartphone', 899.99, 120, 'Electronics'),
('iPad Pro 12.9', 'Professional tablet with M2 chip', 1099.99, 90, 'Electronics'),
('AirPods Pro', 'Wireless earbuds with active noise cancellation', 249.99, 300, 'Audio'),
('Dell XPS 15', 'High-performance Windows laptop', 1599.99, 50, 'Electronics'),
('Canon EOS R6', 'Full-frame mirrorless camera', 2499.99, 30, 'Photography'),
('Nintendo Switch', 'Hybrid gaming console', 299.99, 180, 'Gaming'),
('Apple Watch Series 9', 'Advanced smartwatch with health features', 399.99, 150, 'Wearables');

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP
);

-- Insert test orders
INSERT INTO orders (user_id, product_id, quantity, total_price, status, order_date, delivery_date) VALUES
(1, 1, 1, 999.99, 'delivered', NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days'),
(2, 3, 2, 799.98, 'shipped', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days'),
(3, 5, 1, 1099.99, 'delivered', NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 days'),
(4, 6, 3, 749.97, 'pending', NOW() - INTERVAL '1 day', NULL),
(5, 2, 1, 1199.99, 'processing', NOW() - INTERVAL '3 days', NULL),
(1, 7, 1, 1599.99, 'delivered', NOW() - INTERVAL '20 days', NOW() - INTERVAL '12 days'),
(2, 9, 2, 599.98, 'shipped', NOW() - INTERVAL '2 days', NOW() + INTERVAL '3 days'),
(3, 4, 1, 899.99, 'cancelled', NOW() - INTERVAL '7 days', NULL);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test reviews
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Amazing phone! Camera quality is outstanding.', NOW() - INTERVAL '9 days'),
(2, 3, 4, 'Great noise cancellation, very comfortable for long use.', NOW() - INTERVAL '4 days'),
(3, 5, 5, 'Perfect for professional work. Display is gorgeous!', NOW() - INTERVAL '14 days'),
(5, 2, 5, 'Best laptop I have ever owned. Lightning fast!', NOW() - INTERVAL '2 days'),
(1, 7, 4, 'Powerful machine but a bit heavy to carry around.', NOW() - INTERVAL '19 days'),
(2, 9, 5, 'So much fun! Great for family gaming.', NOW() - INTERVAL '1 day');

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test categories
INSERT INTO categories (name, description, product_count) VALUES
('Electronics', 'Electronic devices and gadgets', 6),
('Audio', 'Headphones, speakers, and audio equipment', 2),
('Photography', 'Cameras and photography equipment', 1),
('Gaming', 'Gaming consoles and accessories', 1),
('Wearables', 'Smartwatches and fitness trackers', 1);