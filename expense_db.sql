CREATE DATABASE IF NOT EXISTS expense_db;

USE expense_db;

CREATE TABLE expenses (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO expenses (name, category, amount) VALUES
('Lunch', 'Food', 150.00),
('Taxi', 'Transport', 200.00),
('Movie', 'Entertainment', 120.00),
('Groceries', 'Food', 800.00);