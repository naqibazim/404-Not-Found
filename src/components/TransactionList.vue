<template>
  <div class="transaction-list">
    <h2>History</h2>
    
    <div class="transactions">
      <div 
        v-for="transaction in transactions" 
        :key="transaction.id" 
        class="transaction"
      >
        <div class="transaction-info">
          <strong>{{ transaction.name }}</strong>
          <span>{{ transaction.date }}</span>
          <span class="category">{{ transaction.category }}</span>
        </div>
        <span 
          class="amount" 
          :class="transaction.type === 'income' ? 'positive' : 'negative'"
        >
          {{ transaction.type === 'income' ? '+' : '-' }} ${{ Math.abs(transaction.amount).toFixed(2) }}
        </span>
      </div>
    </div>
    
    <AddTransaction @click="showAddModal = true" />
    <button class="see-all">See all</button>

    <!-- Add Income Modal -->
    <AddIncome 
      v-if="showAddModal" 
      @close="showAddModal = false" 
      @add-income="addNewIncome"
    />
  </div>
</template>

<script>
import AddTransaction from './AddTransaction.vue';
import AddIncome from './AddIncome.vue';

export default {
  name: 'TransactionList',
  components: {
    AddTransaction,
    AddIncome
  },
  data() {
    return {
      showAddModal: false,
      transactions: [
        // Sample data
        {
          id: 1,
          name: "Salary",
          amount: 2500,
          date: "2023-05-01",
          type: "income",
          category: "Salary"
        },
        {
          id: 2,
          name: "Dinner",
          amount: -45.50,
          date: "2023-05-15",
          type: "expense",
          category: "Food & Beverages"
        }
      ]
    };
  },
  methods: {
    addNewIncome(income) {
      const newTransaction = {
        id: Date.now(),
        name: income.name,
        amount: parseFloat(income.amount),
        date: new Date().toISOString().split('T')[0],
        type: "income",
        category: "Income"
      };
      this.transactions.unshift(newTransaction);
      this.showAddModal = false;
    }
  }
}
</script>

<style scoped>
.transaction-list h2 {
  font-size: 18px;
  color: #111827;
  font-weight: 600;
  margin-bottom: 16px;
}

.transactions {
  margin-bottom: 16px;
}

.transaction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.transaction:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  flex-direction: column;
}

.transaction-info strong {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.transaction-info span {
  font-size: 12px;
  color: #9ca3af;
}

.transaction-info .category {
  font-size: 12px;
  color: #4b5563;
  font-style: italic;
}

.amount {
  font-weight: 600;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

.see-all {
  width: 100%;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 12px;
}

.see-all:hover {
  background: #f3f4f6;
}
</style>