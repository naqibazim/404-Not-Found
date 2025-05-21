<template>
  <div class="transactions-page">
    <h2>All Transactions</h2>
    
    <div class="transactions-container">
      <div 
        v-for="(transaction, index) in allTransactions" 
        :key="index" 
        class="transaction-item"
      >
        <div class="transaction-info">
          <span class="category">{{ transaction.category }}</span>
          <span class="date">{{ formatDate(transaction.date) }}</span>
        </div>
        <span class="amount" :class="transaction.type">
          {{ transaction.type === 'income' ? '+' : '-' }}RM{{ Math.abs(transaction.amount).toFixed(2) }}
        </span>
      </div>
    </div>

    <button class="add-transaction" @click="showAddTransaction = true">
      <span>+ Add Transaction</span>
    </button>

    <AddTransaction 
      v-if="showAddTransaction"
      @close="showAddTransaction = false"
      @add-transaction="handleAddTransaction"
    />
  </div>
</template>

<script>
import AddTransaction from './AddTransaction.vue';

export default {
  name: 'TransactionsPage',
  components: {
    AddTransaction
  },
  data() {
    return {
      allTransactions: [],
      showAddTransaction: false
    };
  },
  created() {
    this.loadAllTransactions();
  },
  methods: {
    loadAllTransactions() {
      this.allTransactions = JSON.parse(localStorage.getItem('expenses')) || [];
      // Sort by date (newest first)
      this.allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    handleAddTransaction(transaction) {
      let transactions = JSON.parse(localStorage.getItem('expenses')) || [];
      transaction.id = Date.now();
      transactions.unshift(transaction);
      localStorage.setItem('expenses', JSON.stringify(transactions));
      
      // Reload data
      this.loadAllTransactions();
    }
  }
};
</script>

<style scoped>
.transactions-page {
  padding: 20px;
  color: white;
  margin-left: 220px;
  margin-right: 270px;
}

.transactions-container {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  backdrop-filter: blur(2px);
  max-height: 70vh;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  flex-direction: column;
}

.transaction-info .category {
  font-weight: 600;
  margin-bottom: 4px;
}

.transaction-info .date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.transaction-item .amount {
  font-weight: bold;
}

.transaction-item .amount.income {
  color: #42b983;
}

.transaction-item .amount.expense {
  color: #ff6b6b;
}

.add-transaction {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
}

.add-transaction:hover {
  background-color: #338a66;
}

h2 {
  color: #42b983;
  margin-bottom: 20px;
}
</style>