function getEditId() {

    const params = new URLSearchParams(window.location.search);

    return params.get("edit");
}

async function saveExpense() {

    const name = document.getElementById("expense-name").value.trim();

    const amountInput = document.getElementById("expense-amount").value.trim();

    const category = document.getElementById("expense-category").value;

    const amount = parseFloat(amountInput);

    if (name === "" || amountInput === "" || category === ""
    ) {

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

        let response;

        // UPDATE

        if (editId) {

            response = await fetch(`/api/expenses/${editId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(expense)
                }
            );

        }

        // CREATE

        else {

            response = await fetch("/api/expenses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(expense)
                }
            );

        }


        const result = await response.json();


        if (!response.ok) {

            throw new Error( result.message || "Unable to save expense");

        }

        window.location.href = "expenses.html";


    } catch (error) {

        console.error("Save error:", error);

        alert("Unable to save expense. " + error.message);

    }
}

async function displayExpenses() {

    const expenseList = document.getElementById("expense-list");

    if (!expenseList) {
        return;
    }


    try {

        const response = await fetch("/api/expenses");

        if (!response.ok) {

            throw new Error(
                "Unable to retrieve expenses"
            );

        }


        const expenses = await response.json();


        expenseList.innerHTML = "";

        if (expenses.length === 0) {

            expenseList.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-message">No expenses added yet.</td>
                </tr>
            `;

            displayTotal(expenses);

            return;
        }

        expenses.forEach(
            expense => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `

                    <td>
                        ${expense.name}
                    </td>

                    <td>
                        ${expense.category}
                    </td>

                    <td>
                        ₱${Number(
                            expense.amount
                        ).toFixed(2)}
                    </td>

                    <td>

                        <a href="expense-form.html?edit=${expense.id}" class="edit-button">Edit</a>
                        <button type="button" class="delete-button" onclick="deleteExpense(${expense.id})">Delete</button>

                    </td>
                `;


                expenseList.appendChild(
                    row
                );

            }
        );


        displayTotal(expenses);


    } catch (error) {

        console.error("Load error:", error);

        expenseList.innerHTML = `
            <tr>
                <td colspan="4">Unable to load expenses.</td>
            </tr>
        `;

    }
}

// CALCULATE TOTAL

function displayTotal(expenses) {

    const totalElement =document.getElementById("total-amount");

    if (!totalElement) {
        return;
    }

    let total = 0;

    expenses.forEach(
        expense => {

            total += Number(expense.amount);

        }
    );


    totalElement.textContent = "₱" + total.toFixed(2);
}

// DELETE EXPENSE

async function deleteExpense(id) {

    const confirmed = confirm("Are you sure you want to delete this expense?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch( `/api/expenses/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.message || "Unable to delete expense");

        }

        displayExpenses();


    } catch (error) {

        console.error("Delete error:",error);

        alert("Unable to delete expense.");

    }
}

async function loadExpenseForEdit() {

    const editId = getEditId();

    if (!editId) {
        return;
    }

    const nameInput = document.getElementById("expense-name");

    if (!nameInput) {
        return;
    }


    try {

        const response = await fetch(`/api/expenses/${editId}`);

        if (!response.ok) {

            throw new Error("Expense not found");

        }

        const expense = await response.json();

        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;

        const title = document.getElementById("form-title");
        const subtitle = document.getElementById("form-subtitle");
        const button = document.getElementById("save-button");

        if (title) {

            title.textContent =
                "Edit Expense";

        }

        if (subtitle) {

            subtitle.textContent = "Update the expense information below";

        }

        if (button) {

            button.textContent = "Update Expense";

        }


    } catch (error) {

        console.error("Edit load error:",error);

        alert("Unable to load expense.");

    }
}

async function displayDashboard() {

    const dashboardTotal = document.getElementById("dashboard-total");

    if (!dashboardTotal) {
        return;
    }


    try {

        const response = await fetch("/api/expenses");

        if (!response.ok) {

            throw new Error("Unable to retrieve expenses");

        }


        const expenses = await response.json();

        let total = 0;
        let food = 0;
        let transport = 0;
        let others = 0;

        expenses.forEach(
            expense => {

                const amount = Number(expense.amount);

                total += amount;

                if (expense.category === "Food") {

                    food += amount;

                }

                else if (expense.category === "Transport") {

                    transport += amount;

                }

                else {

                    others += amount;

                }

            }
        );

        document.getElementById("dashboard-total").textContent = "₱" + total.toFixed(2);
        document.getElementById("food-total").textContent = "₱" + food.toFixed(2);
        document.getElementById("transpo-total").textContent = "₱" + transport.toFixed(2);
        document.getElementById("other-total").textContent = "₱" + others.toFixed(2);

    } catch (error) {

        console.error("Dashboard error:", error);

    }
}

document.addEventListener("DOMContentLoaded",function () {

    displayExpenses();
    displayDashboard();
    loadExpenseForEdit();

    const expenseForm = document.getElementById("expense-form");

        if (expenseForm) {

            expenseForm.addEventListener("submit", function (event) {

                    event.preventDefault();
                    saveExpense();

                }
            );

        }

    }
);