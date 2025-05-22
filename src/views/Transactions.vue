<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'
import { formatCurrency } from '../utils/formatter'
import TransactionModal from '../components/TransactionModal.vue'

const store = useTransactionStore()
const showModal = ref(false)
const editingTransaction = ref(null)
const searchQuery = ref('')

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const filteredTransactions = computed(() => {
  return store.transactions.filter(transaction => {
    const matchesSearch =
      transaction.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesMonth = transaction.date.includes(store.selectedMonth)

    return matchesSearch && matchesMonth
  })
})

function isIncome(transaction: any): boolean {
  return transaction.category === 'Freelance' || transaction.category === 'Online Sale'
}

function openModal(transaction = null) {
  editingTransaction.value = transaction
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTransaction.value = null
}

function handleSaveTransaction(transaction: any) {
  if (editingTransaction.value) {
    store.updateTransaction({ ...editingTransaction.value, ...transaction })
  } else {
    store.addTransaction(transaction)
  }
  closeModal()
}

function handleDeleteTransaction(id: string) {
  store.deleteTransaction(id)
}
</script>

<template>
  <div class="transactions-view">
    <div class="transactions-header">
      <h1>All Transactions</h1>
      <button class="add-btn" @click="openModal()">+ Add Transaction</button>
    </div>

    <!-- Month Selector -->
    <div class="month-selector">
      <h3>Select Month</h3>
      <div class="months-list">
        <button
          v-for="month in months"
          :key="month"
          @click="store.setSelectedMonth(month)"
          :class="{ active: store.selectedMonth === month }"
        >
          {{ month }}
        </button>
      </div>
    </div>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search transactions..." 
        class="search-input" 
      />
    </div>

    <div class="card transactions-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="transaction-row">
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.category }}</td>
            <td>{{ transaction.description || '-' }}</td>
            <td class="amount-cell">
              <p class="transaction-amount" :class="{ income: isIncome(transaction) }">
                {{ (isIncome(transaction) ? '+' : '-') + formatCurrency(transaction.amount) }}
              </p>
            </td>
            <td class="actions-cell">
              <button class="action-btn edit-btn" @click="openModal(transaction)">Edit</button>
              <button class="action-btn delete-btn" @click="handleDeleteTransaction(transaction.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="5" class="no-results">No transactions found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <TransactionModal 
      v-if="showModal" 
      :transaction="editingTransaction"
      @close="closeModal" 
      @add-transaction="handleSaveTransaction" 
    />
  </div>
</template>

<style scoped>
.transactions-view {
  width: 100%;
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  color: var(--text-light);
  font-size: 1rem;
}

.transactions-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

th {
  font-weight: 600;
  color: var(--text-muted);
}

.transaction-row:hover {
  background-color: rgba(45, 55, 72, 0.8);
}

.amount-cell {
  font-weight: 600;
}

.transaction-amount {
  font-weight: 600;
  font-size: 1.125rem;
  color: #EF4444; /* expense red */
}

.transaction-amount.income {
  color: #10B981; /* income green */
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.edit-btn {
  background-color: #4299e1;
}

.edit-btn:hover {
  background-color: #3182ce;
}

.delete-btn {
  background-color: #f56565;
}

.delete-btn:hover {
  background-color: #e53e3e;
}

.no-results {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
}

.month-selector {
  margin-bottom: 1.5rem;
  text-align: center;
}

.months-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.months-list button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.months-list button.active {
  background-color: var(--primary-color);
  color: white;
}
</style>
