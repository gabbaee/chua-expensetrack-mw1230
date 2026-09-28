const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Allow JSON data
app.use(express.json());

// Serve HTML, CSS and JS files
app.use(express.static(__dirname));

// Connect to MySQL
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


// ========================================
// GET - Retrieve all expenses
// ========================================

app.get("/api/expenses", (req, res) => {

    const sql = "SELECT * FROM expenses ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });

});


// ========================================
// GET - Retrieve one expense
// ========================================

app.get("/api/expenses/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM expenses WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(results[0]);
    });

});


// ========================================
// POST - Add expense
// ========================================

app.post("/api/expenses", (req, res) => {

    const name = req.body.name;
    const category = req.body.category;
    const amount = req.body.amount;

    if (!name || !category || !amount) {
        return res.status(400).json({
            message: "Please fill in all fields"
        });
    }

    const sql = `
        INSERT INTO expenses
        (name, category, amount)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, category, amount],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(201).json({
                message: "Expense added successfully",
                id: result.insertId
            });
        }
    );

});


// ========================================
// PUT - Update expense
// ========================================

app.put("/api/expenses/:id", (req, res) => {

    const id = req.params.id;

    const name = req.body.name;
    const category = req.body.category;
    const amount = req.body.amount;

    const sql = `
        UPDATE expenses
        SET name = ?, category = ?, amount = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, category, amount, id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.json({
                message: "Expense updated successfully"
            });
        }
    );

});


// ========================================
// DELETE - Delete expense
// ========================================

app.delete("/api/expenses/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM expenses WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });
    });

});


// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
