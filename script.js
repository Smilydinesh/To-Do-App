let entries = JSON.parse(localStorage.getItem('entries')) || [];

const form = document.getElementById('entry-form');
const entryBody = document.getElementById('entries-body');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const totalBalance = document.getElementById('net-balance');
const resetButton = document.getElementById('reset-btn');

let totalIncome = 0;
let totalExpense = 0;

form.addEventListener('submit', addEntry);
resetButton.addEventListener('click', resetForm);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', renderEntries);
});

document.addEventListener('DOMContentLoaded', () => {
   renderEntries();
    updateSummary();
});

function addEntry(entry){
    entry.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    const newEntry = {id: Date.now(), description, amount, type};
    entries.push(newEntry);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
    updateSummary();
    form.reset();
}

function renderEntries(){
    const filterValue = document.querySelector('input[name="filter"]:checked').value;
    entryBody.innerHTML = '';

    const filteredEntries = entries.filter(entry => filterValue === 'all' || entry.type === filterValue);
    filteredEntries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.description}</td>
            <td>${entry.amount}</td>
            <td>${entry.type}</td>
            <td class="actions">
                <button1 onclick="editEntry(${entry.id})">Edit</button1>
                <button2 onclick="deleteEntry(${entry.id})">Delete</button2>
            </td>`;
        entryBody.appendChild(row);
    });
}

function updateSummary() {
    totalIncome = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
    totalExpense = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpense;

    totalIncomeDisplay.innerText = totalIncome.toFixed(2);
    totalExpenseDisplay.innerText = totalExpense.toFixed(2);
    totalBalance.innerText = netBalance.toFixed(2);
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    if (entry) {
        document.getElementById('description').value = entry.description;
        document.getElementById('amount').value = entry.amount;
        document.getElementById('type').value = entry.type;
        deleteEntry(id);
    }
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
    updateSummary();
}

function resetForm() {
    form.reset();
}

function applyResponsiveStyles() {
    const entriesTable = document.getElementById('entries-table');
    const windowWidth = window.innerWidth;

    if (windowWidth < 400) {
        entriesTable.style.fontSize = '12px';
        entriesTable.style.width = '20%';
    } else if (windowWidth < 660) {
        entriesTable.style.fontSize = '14px';
        entriesTable.style.width = '100%';
        entryBody.style.width = '100%';
    } else if (windowWidth < 800) {
        entriesTable.style.fontSize = '16px';
        entriesTable.style.width = '100%';
    } else {
        entriesTable.style.fontSize = '18px';
        entriesTable.style.width = '100%';
    }
}

applyResponsiveStyles();

window.addEventListener('resize', applyResponsiveStyles);
