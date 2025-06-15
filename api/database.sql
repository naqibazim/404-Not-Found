-- Create the database
CREATE DATABASE IF NOT EXISTS dashboard_db;
USE dashboard_db;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('income', 'expense') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Create monthly_stats table for caching monthly statistics
CREATE TABLE IF NOT EXISTS monthly_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month VARCHAR(9) NOT NULL, -- Format: 'YYYY-MM'
    total_income DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_expenses DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_month (month)
);

-- Insert default categories
INSERT INTO categories (name, type) VALUES
-- Income categories
('Freelance', 'income'),
('Online Sale', 'income'),
-- Expense categories
('Groceries', 'expense'),
('Utilities', 'expense'),
('Transport', 'expense'),
('Dining', 'expense'),
('Internet', 'expense'),
('Movie', 'expense'),
('Shopping', 'expense'),
('Petrol', 'expense'),
('Insurance', 'expense');

-- Insert sample transactions for May 2024
INSERT INTO transactions (id, category_id, amount, transaction_date, description) VALUES
-- Income transactions
(UUID(), 1, 1500.00, '2024-05-01', 'Freelance project payment'),
(UUID(), 2, 250.00, '2024-05-15', 'Online store sale'),
-- Expense transactions
(UUID(), 3, 200.00, '2024-05-02', 'Weekly groceries'),
(UUID(), 4, 150.00, '2024-05-05', 'Electricity bill'),
(UUID(), 5, 50.00, '2024-05-10', 'Bus fare'),
(UUID(), 6, 80.00, '2024-05-12', 'Dinner with friends'),
(UUID(), 7, 100.00, '2024-05-15', 'Internet bill'),
(UUID(), 8, 30.00, '2024-05-20', 'Movie tickets'),
(UUID(), 9, 150.00, '2024-05-22', 'Shopping mall'),
(UUID(), 10, 100.00, '2024-05-25', 'Petrol fill up'),
(UUID(), 11, 200.00, '2024-05-28', 'Car insurance');

-- Insert initial monthly stats for May 2024
INSERT INTO monthly_stats (month, total_income, total_expenses) VALUES
('2024-05', 1750.00, 1260.00);

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_monthly_stats_month ON monthly_stats(month);