function getEditId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("edit");
}


// ========================================
// ADD OR UPDATE EXPENSE
// ========================================

async function addExpense() {

    const name = document
        .getElementById("expense-name")
        .value
        .trim();

    const amountInput = document
        .getElementById("expense-amount")
        .value
        .trim();

    const category = document
        .getElementById("expense-category")
        .value;

    const amount = parseFloat(amountInput);

    if (name === "" || amountInput === "" || category === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const expense = {
        name: name,
        category: category,
        amount: amount
    };

    const editId = getEditId();

    try {

        // EDIT EXISTING EXPENSE
        if (editId !== null) {

            await fetch(`/api/expenses/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expense)
            });

        }

        // ADD NEW EXPENSE
        else {

            await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expense)
            });

        }

        window.location.href = "expenses.html";

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");

    }
}


// ========================================
// DISPLAY EXPENSES
// ========================================

async function displayExpenses() {

    const expenseList =
        document.getElementById("expense-list");

    if (!expenseList) {
        return;
    }

    try {

        const response = await fetch("/api/expenses");

        const expenses = await response.json();

        expenseList.innerHTML = "";

        if (expenses.length === 0) {

            expenseList.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-message">
                        No expenses added yet.
                    </td>
                </tr>
            `;

            displayTotal(expenses);

            return;
        }

        expenses.forEach(expense => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>

                <td>${expense.category}</td>

                <td>
                    ₱${Number(expense.amount).toFixed(2)}
                </td>

                <td>
                    <a
                        href="expense-form.html?edit=${expense.id}"
                        class="edit-button"
                    >
                        Edit
                    </a>

                    <button
                        class="delete-button"
                        onclick="deleteExpense(${expense.id})"
                    >
                        Delete
                    </button>
                </td>
            `;

            expenseList.appendChild(row);

        });

        displayTotal(expenses);

    } catch (error) {

        console.error(error);

    }
}


// ========================================
// DISPLAY TOTAL
// ========================================

function displayTotal(expenses) {

    const totalElement =
        document.getElementById("total-amount");

    if (!totalElement) {
        return;
    }

    let total = 0;

    expenses.forEach(expense => {
        total += Number(expense.amount);
    });

    totalElement.textContent =
        "₱" + total.toFixed(2);
}


// ========================================
// DELETE EXPENSE
// ========================================

async function deleteExpense(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        await fetch(`/api/expenses/${id}`, {
            method: "DELETE"
        });

        displayExpenses();

    } catch (error) {

        console.error(error);

        alert("Unable to delete expense.");

    }
}


// ========================================
// LOAD EXPENSE FOR EDITING
// ========================================

async function loadExpenseForEdit() {

    const editId = getEditId();

    if (editId === null) {
        return;
    }

    const nameInput =
        document.getElementById("expense-name");

    if (!nameInput) {
        return;
    }

    try {

        const response =
            await fetch(`/api/expenses/${editId}`);

        const expense =
            await response.json();

        document.getElementById("expense-name").value =
            expense.name;

        document.getElementById("expense-amount").value =
            expense.amount;

        document.getElementById("expense-category").value =
            expense.category;

        const title =
            document.getElementById("form-title");

        const subtitle =
            document.getElementById("form-subtitle");

        const saveButton =
            document.getElementById("save-button");

        if (title) {
            title.textContent = "Edit Expense";
        }

        if (subtitle) {
            subtitle.textContent =
                "Update the expense information below";
        }

        if (saveButton) {
            saveButton.textContent = "Update Expense";
        }

    } catch (error) {

        console.error(error);

    }
}


// ========================================
// DISPLAY DASHBOARD
// ========================================

async function displayExpenses() {

    const expenseList = document.getElementById("expense-list");

    if (!expenseList) {
        return;
    }

    try {

        const response = await fetch("/api/expenses");
        const expenses = await response.json();

        console.log(expenses);

        expenseList.innerHTML = "";

        if (expenses.length === 0) {
            expenseList.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-message">
                        No expenses added yet.
                    </td>
                </tr>
            `;

            displayTotal(expenses);
            return;
        }

        expenses.forEach(expense => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.category}</td>
                <td>₱${Number(expense.amount).toFixed(2)}</td>

                <td>
                    <a 
                        href="expense-form.html?edit=${expense.id}" 
                        class="edit-button">
                        Edit
                    </a>

                    <button 
                        class="delete-button"
                        onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </td>
            `;

            expenseList.appendChild(row);
        });

        displayTotal(expenses);

    } catch (error) {
        console.error("Error loading expenses:", error);
    }
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayExpenses();
        displayDashboard();
        loadExpenseForEdit();

        const expenseForm =
            document.getElementById("expense-form");

        if (expenseForm) {

            expenseForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    addExpense();

                }
            );

        }

    }
);