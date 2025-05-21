<script setup lang="ts">
import { ref } from 'vue'
import { useTransactionStore } from '../stores/transaction'
import { formatCurrency } from '../utils/formatter'

const store = useTransactionStore()
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const activeMonth = ref('May')

function selectMonth(month: string) {
  activeMonth.value = month
  store.setSelectedMonth(month)
}

const getMonthStats = (month: string) => {
  const monthTransactions = store.getTransactionsByMonth(month)
  const income = monthTransactions
    .filter(t => t.category === 'Freelance' || t.category === 'Online Sale')
    .reduce((sum, t) => sum + t.amount, 0)
  const expenses = monthTransactions
    .filter(t => t.category !== 'Freelance' && t.category !== 'Online Sale')
    .reduce((sum, t) => sum + t.amount, 0)
  return { income, expenses }
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Select Month</h2>
    </div>
    <div class="month-list">
      <button
        v-for="month in months"
        :key="month"
        :class="['month-btn', activeMonth === month ? 'active' : '']"
        @click="selectMonth(month)"
      >
        <div class="month-name">{{ month }}</div>
        <div class="month-stats" v-if="getMonthStats(month).income > 0 || getMonthStats(month).expenses > 0">
          <div class="stat income">↗️ {{ formatCurrency(getMonthStats(month).income) }}</div>
          <div class="stat expenses">↘️ {{ formatCurrency(getMonthStats(month).expenses) }}</div>
        </div>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background-color: rgba(26, 32, 44, 0.8);
  backdrop-filter: blur(10px);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.month-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.month-btn {
  background-color: transparent;
  color: var(--text-light);
  border: none;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.month-btn:hover {
  background-color: rgba(45, 55, 72, 0.7);
}

.month-btn.active {
  background-color: var(--primary-color);
}

.month-name {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.month-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat.income {
  color: #10B981;
}

.stat.expenses {
  color: #EF4444;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    padding: 1rem;
  }
  
  .month-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .month-btn {
    text-align: center;
    padding: 0.5rem;
  }
  
  .month-stats {
    display: none;
  }
}
</style>