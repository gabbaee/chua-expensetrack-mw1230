const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expense_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL");
});

app.get("/api/expenses", (req, res) => {
    const sql = `
        SELECT *
        FROM expenses
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});

app.get("/api/expenses/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT *
        FROM expenses
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json(results[0]);
    });
});

// CREATE EXPENSE

app.post("/api/expenses", (req, res) => {
    const { name, category, amount } = req.body;

    if (!name || !category || amount === undefined || Number(amount) <= 0) {
        return res.status(400).json({
            message: "Please enter valid expense information"
        });
    }

    const sql = `
        INSERT INTO expenses
        (name, category, amount)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, category, amount], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({
            message: "Expense added successfully",
            id: result.insertId
        });
    });
});

// UPDATE EXPENSE

app.put("/api/expenses/:id", (req, res) => {
    const id = req.params.id;
    const { name, category, amount } = req.body;

    if (!name || !category || amount === undefined || Number(amount) <= 0) {
        return res.status(400).json({
            message: "Please enter valid expense information"
        });
    }

    const sql = `
        UPDATE expenses
        SET
            name = ?,
            category = ?,
            amount = ?
        WHERE id = ?
    `;

    db.query(sql, [name, category, amount, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense updated successfully" });
    });
});

// DELETE EXPENSE

app.delete("/api/expenses/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
        DELETE FROM expenses
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});