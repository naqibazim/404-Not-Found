<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'
import { formatCurrency } from '../utils/formatter'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

const store = useTransactionStore()
const selectedPeriod = ref('month')

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const categoryTotals = computed(() => {
  const totals: Record<string, number> = {}

  store.transactions.forEach(transaction => {
    if (!totals[transaction.category]) {
      totals[transaction.category] = 0
    }
    totals[transaction.category] += transaction.amount
  })

  return totals
})

const monthlyTotals = computed(() => {
  const totals: Record<string, number> = {}

  months.forEach(month => {
    totals[month] = store.getTotalByMonth(month)
  })

  return totals
})

const pieChartData = computed(() => {
  const labels = Object.keys(categoryTotals.value)
  const colors = [
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#E91E63', // Pink
    '#FFC107', // Amber
    '#3F51B5', // Indigo
    '#009688', // Teal
    '#795548'  // Brown
  ]

  // Copy colors to avoid mutation
  const backgroundColor = [...colors]

  // Change Petrol category color to bright red
  const petrolIndex = labels.findIndex(label => label.toLowerCase() === 'petrol')
  if (petrolIndex !== -1) {
    backgroundColor[petrolIndex] = '#FF0000' // Bright red for Petrol
  }

  return {
    labels,
    datasets: [
      {
        data: Object.values(categoryTotals.value),
        backgroundColor,
        borderWidth: 0
      }
    ]
  }
})

const barChartData = computed(() => ({
  labels: Object.keys(monthlyTotals.value),
  datasets: [
    {
      label: 'Monthly Expenses',
      data: Object.values(monthlyTotals.value),
      backgroundColor: '#FF5722' // Deep orange
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: 'rgba(255, 255, 255, 0.87)'
      }
    }
  }
}

const barChartOptions = {
  ...chartOptions,
  scales: {
    y: {
      ticks: { color: 'rgba(255, 255, 255, 0.87)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    x: {
      ticks: { color: 'rgba(255, 255, 255, 0.87)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    }
  }
}
</script>

<template>
  <div class="statistics-view">
    <h1>Statistics</h1>

    <div class="stats-period">
      <button
        :class="['period-btn', selectedPeriod === 'month' ? 'active' : '']"
        @click="selectedPeriod = 'month'"
      >
        Monthly
      </button>
      <button
        :class="['period-btn', selectedPeriod === 'category' ? 'active' : '']"
        @click="selectedPeriod = 'category'"
      >
        By Category
      </button>
    </div>

    <div class="charts-container">
      <div class="card chart-card pie-chart" v-if="selectedPeriod === 'category'">
        <h3>Spending by Category</h3>
        <div class="chart-wrapper">
          <Pie :data="pieChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="card chart-card bar-chart" v-if="selectedPeriod === 'month'">
        <h3>Monthly Spending</h3>
        <div class="chart-wrapper">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>
    </div>

    <div class="card stats-summary">
      <h3>Summary</h3>
      <div class="summary-items">
        <div class="summary-item">
          <h4>Total Spending</h4>
          <p class="summary-value">{{ formatCurrency(store.getTotal()) }}</p>
        </div>
        <div class="summary-item">
          <h4>Average per Transaction</h4>
          <p class="summary-value">{{ formatCurrency(store.getAverage()) }}</p>
        </div>
        <div class="summary-item">
          <h4>Highest Expense</h4>
          <p class="summary-value">{{ formatCurrency(store.getHighest()) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-view {
  width: 100%;
}

.stats-period {
  display: flex;
  margin-bottom: 2rem;
  gap: 1rem;
}

.period-btn {
  background-color: var(--card-bg);
  color: var(--text-light);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.period-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  padding: 1.5rem;
}

.chart-card h3 {
  margin-bottom: 1rem;
  text-align: center;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

.stats-summary {
  padding: 1.5rem;
}

.stats-summary h3 {
  margin-bottom: 1.5rem;
}

.summary-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.summary-item {
  text-align: center;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .summary-items {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
