// Select elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addEntryButton = document.getElementById('add-entry');
const resetButton = document.getElementById('reset');
const entryList = document.getElementById('entry-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');
const filters = document.getElementsByName('filter');

let entries = JSON.parse(localStorage.getItem('entries')) || [];


const updateTotals = () => {
  const income = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const expense = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
  totalIncome.textContent = `$${income.toFixed(2)}`;
  totalExpense.textContent = `$${Math.abs(expense).toFixed(2)}`;
  netBalance.textContent = `$${(income + expense).toFixed(2)}`;
};

const renderEntries = (filter = 'all') => {
  entryList.innerHTML = '';
  const filteredEntries = entries.filter(entry =>
    filter === 'all' ? true : entry.type === filter
  );
  filteredEntries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.classList.add('entry');
    li.innerHTML = `
      <span>${entry.description} - $${entry.amount.toFixed(2)}</span>
      <div class="actions">
        <button class="edit" data-index="${index}">Edit</button>
        <button class="delete" data-index="${index}">Delete</button>
      </div>
    `;
    entryList.appendChild(li);
  });
};

const saveEntries = () => {
  localStorage.setItem('entries', JSON.stringify(entries));
};


addEntryButton.addEventListener('click', () => {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  if (!description || isNaN(amount)) return alert('Please enter valid details.');

  const selectedType = [...filters].find(filter => filter.checked)?.value || 'all';

  const type = selectedType === 'income' ? 'income' : 'expense';
  const entryAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

  entries.push({ description, amount: entryAmount, type });
  saveEntries();
  renderEntries();
  updateTotals();
  descriptionInput.value = '';
  amountInput.value = '';
});

resetButton.addEventListener('click', () => {
  descriptionInput.value = '';
  amountInput.value = '';
});

entryList.addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains('delete')) {
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
    updateTotals();
  } else if (e.target.classList.contains('edit')) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = Math.abs(entry.amount);
    entries.splice(index, 1);
  }
});

filters.forEach(filter => {
  filter.addEventListener('change', () => {
    renderEntries(filter.value);
  });
});


renderEntries();
updateTotals();
