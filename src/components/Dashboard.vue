<template>
  <div class="dashboard">
    <!-- Sidebar for months on the left -->
    <div class="month-sidebar">
      <h3>Select Month</h3>
      <div class="month-buttons">
        <span 
          v-for="month in months" 
          :key="month" 
          @click="loadMonthlyData(month)"
          class="month-item"
          :class="{ active: selectedMonth === month }"
        >
          {{ month }}
        </span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Monthly Dashboard Content -->
      <div v-if="selectedMonth">
        <div class="header-section">
          <h3>{{ selectedMonth }} Expenses</h3>
          <div class="total-amount">
            <span>Total: </span>
            <span class="amount">RM{{ monthlyTotal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Latest Expenses Section -->
        <div class="latest-expenses">
          <h4>Latest Expenses</h4>
          <ul>
            <li v-for="(expense, index) in monthlyExpenses" :key="index">
              <div class="expense-item">
                <div class="expense-info">
                  <span class="category">{{ expense.category }}</span>
                  <span class="date">{{ formatDate(expense.date) }}</span>
                </div>
                <span class="amount">RM{{ expense.amount.toFixed(2) }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Daily Expenses Section (Bar Chart) -->
        <div class="daily-expenses">
          <h4>Daily Expenses</h4>
          <div class="chart-container">
            <BarChart :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- No Month Selected View -->
      <div v-else class="no-month-selected">
        <h3>Please select a month to view expenses</h3>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="sidebar">
      <div class="sidebar-section">
        <h3>Quick Actions</h3>
        <button @click="goHome">Home</button>
        <button @click="goToTransaction">Transactions</button>
        <button @click="goToStatistics">Statistics</button>
      </div>

      <!-- In Dashboard.vue, modify the sidebar section -->
<div class="sidebar-section">
  <h3>Recent Transactions</h3>
  <div class="recent-transactions">
    <div 
      v-for="(transaction, index) in recentTransactions" 
      :key="index" 
      class="transaction-item"
    >
      <span class="category">{{ transaction.category }}</span>
      <span class="amount" :class="transaction.type">{{ transaction.type === 'income' ? '+' : '-' }}RM{{ Math.abs(transaction.amount).toFixed(2) }}</span>
    </div>
  </div>
</div>
    </div>

    <!-- Add Transaction  -->
    <AddTransaction 
      v-if="showAddTransaction"
      @close="showAddTransaction = false"
      @add-transaction="handleAddTransaction"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import AddTransaction from './AddTransaction.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'ExpenseDashboard',
  components: {
    BarChart: Bar,
    AddTransaction
  },
  data() {
    return {
      selectedMonth: null,
      monthlyTotal: 0,
      months: [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthlyExpenses: [],
      recentTransactions: [],
      showAddTransaction: false,
      chartData: {
        labels: Array.from({length: 31}, (_, i) => i + 1), // Days 1-31
        datasets: [{
          label: 'Daily Expenses',
          data: Array(31).fill(0),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 2
        }]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'white',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'RM' + context.raw.toFixed(2);
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#42b983',
            bodyColor: 'white',
            borderColor: '#42b983',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day of Month',
              color: 'white',
              font: {
                weight: 'bold'
              }
            },
            ticks: {
              color: 'white',
              stepSize: 1,
              min: 1,
              max: 31
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount (RM)',
              color: 'white',
              font: {
                weight: 'bold'
              }
            },
            beginAtZero: true,
            suggestedMax: 1000,
            ticks: {
              color: 'white',
              stepSize: 10,
              callback: function(value) {
                return 'RM' + value;
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    };
  },
  created() {
    if (!localStorage.getItem('expenses')) {
      const mayData = [
        { category: 'Groceries', amount: 120.50, type: 'expense', date: '2024-05-02' },
        { category: 'Utilities', amount: 85.00, type: 'expense', date: '2024-05-05' },
        { category: 'Transport', amount: 45.75, type: 'expense', date: '2024-05-07' },
        { category: 'Dining', amount: 60.25, type: 'expense', date: '2024-05-10' },
        { category: 'Freelance', amount: 500.00, type: 'income', date: '2024-05-11' },
        { category: 'Internet', amount: 90.00, type: 'expense', date: '2024-05-12' },
        { category: 'Movie', amount: 35.00, type: 'expense', date: '2024-05-15' },
        { category: 'Online Sale', amount: 150.00, type: 'income', date: '2024-05-16' },
        { category: 'Shopping', amount: 200.00, type: 'expense', date: '2024-05-18' },
        { category: 'Petrol', amount: 70.00, type: 'expense', date: '2024-05-20' },
        { category: 'Insurance', amount: 180.00, type: 'expense', date: '2024-05-22' },
        { category: 'Gift', amount: 300.00, type: 'income', date: '2024-05-25' },
        { category: 'Medical', amount: 100.00, type: 'expense', date: '2024-05-28' },
        { category: 'Snacks', amount: 15.50, type: 'expense', date: '2024-05-29' },
        { category: 'Books', amount: 60.00, type: 'expense', date: '2024-05-30' }
      ];
      mayData.forEach((item, index) => item.id = Date.now() + index);
      localStorage.setItem('expenses', JSON.stringify(mayData));
    }
    this.loadRecentTransactions();
    // Set current month as default
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    this.loadMonthlyData(currentMonth);
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    loadMonthlyData(month) {
      this.selectedMonth = month;
      let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

      this.monthlyExpenses = expenses.filter(expense => {
        const expenseMonth = new Date(expense.date).toLocaleString('default', { month: 'long' });
        return expenseMonth === month;
      });

      // Calculate monthly total
      this.monthlyTotal = this.monthlyExpenses.reduce((sum, expense) => {
        return sum + (expense.type === 'expense' ? expense.amount : 0);
      }, 0);

      this.loadDailyData();
    },
    loadDailyData() {
      // Create array for days 1-31 with 0 amount
      const dailyData = Array(31).fill(0);
      
      // Sum amounts for each day
      this.monthlyExpenses.forEach(expense => {
        if (expense.type === 'expense') {
          const day = new Date(expense.date).getDate();
          if (day >= 1 && day <= 31) {
            dailyData[day - 1] += expense.amount;
          }
        }
      });

      // Update chart data
      this.chartData = {
        ...this.chartData,
        datasets: [{
          ...this.chartData.datasets[0],
          data: dailyData,
          backgroundColor: dailyData.map(amount => 
            amount > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(201, 203, 207, 0.5)'
          ),
          borderColor: dailyData.map(amount => 
            amount > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(201, 203, 207, 1)'
          )
        }]
      };
    },
    loadRecentTransactions() {
      let transactions = JSON.parse(localStorage.getItem('expenses')) || [];
      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.recentTransactions = transactions.slice(0, 5);
    },
    handleAddTransaction(transaction) {
      let transactions = JSON.parse(localStorage.getItem('expenses')) || [];
      transaction.id = Date.now();
      transactions.unshift(transaction);
      localStorage.setItem('expenses', JSON.stringify(transactions));
      
      // Reload data
      this.loadMonthlyData(this.selectedMonth);
      this.loadRecentTransactions();
    },
    goHome() {
      this.$router.push('/');
    },
    goToTransaction() {
      this.$router.push('/transactions');
    },
    goToStatistics() {
      this.$router.push('/statistics');
    }
  }
};
</script>

<style scoped>
/* General Dashboard */
.dashboard {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  position: absolute;
  background-image: url('@/assets/pexels-tima-miroshnichenko-6694866.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  min-height: 100vh;
  top: 0;
  left: 0;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Left Sidebar */
.month-sidebar {
  width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.75);
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255,255,255,0.1);
}

.month-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.month-item {
  padding: 12px;
  background: linear-gradient(145deg, rgba(66, 185, 131, 0.25), rgba(66, 185, 131, 0.15));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.month-item:hover {
  background-color: rgba(66, 185, 131, 0.4);
}

.month-item.active {
  background-color: #42b983;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

/* Main Content Area */
.main-content {
  flex-grow: 1;
  margin-left: 220px;
  margin-right: 270px;
  padding: 30px;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.total-amount {
  font-size: 1.3rem;
}

.total-amount .amount {
  font-weight: bold;
  color: #42b983;
}

/* Latest Expenses */
.latest-expenses,
.daily-expenses {
  background: rgba(0, 0, 0, 0.6);
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 30px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.latest-expenses ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.latest-expenses li {
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.latest-expenses li:last-child {
  border-bottom: none;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expense-info {
  display: flex;
  flex-direction: column;
}

.expense-info .category {
  font-weight: 600;
  margin-bottom: 4px;
}

.expense-info .date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.expense-item .amount {
  font-weight: bold;
  font-size: 1rem;
}

/* Daily Chart */
.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

/* Empty State */
.no-month-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  backdrop-filter: blur(4px);
  font-style: italic;
}

/* Right Sidebar */
.sidebar {
  width: 250px;
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 25px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 1;
  box-shadow: -2px 0 10px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255,255,255,0.1);
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar-section h3 {
  color: #42b983;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

/* Sidebar Buttons */
.sidebar button {
  padding: 12px;
  background: rgba(66, 185, 131, 0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar button:hover {
  background: rgba(66, 185, 131, 0.4);
  transform: translateY(-1px);
}

.add-transaction {
  background-color: #42b983 !important;
  color: white;
  font-weight: bold;
}

.add-transaction:hover {
  background-color: #338a66 !important;
}

/* Recent Transactions */
.recent-transactions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: background 0.3s ease;
}

.transaction-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.transaction-item .category {
  font-size: 0.9rem;
}

.transaction-item .amount {
  font-weight: bold;
  font-size: 0.9rem;
}

.transaction-item .amount.income {
  color: #42b983;
}

.transaction-item .amount.expense {
  color: #ff6b6b;
}

/* Headings */
h3, h4 {
  color: #42b983;
  margin-bottom: 15px;
}
</style>
