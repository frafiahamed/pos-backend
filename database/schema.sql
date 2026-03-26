CREATE DATABASE pos_db;
USE pos_db;

-- Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  parent_id INT DEFAULT NULL
);

-- Products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  category_id INT
);

-- Variants (MAIN)
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100) UNIQUE,
  color VARCHAR(50),
  size VARCHAR(10),
  price DECIMAL(10,2),
  stock INT DEFAULT 0,
  image_url TEXT
);

-- Orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_amount DECIMAL(10,2),
  final_amount DECIMAL(10,2),
  payment_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  variant_id INT,
  quantity INT,
  price DECIMAL(10,2),
  final_price DECIMAL(10,2)
);

-- Stock Movement
CREATE TABLE stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variant_id INT,
  type VARCHAR(10),
  quantity INT,
  reason VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);