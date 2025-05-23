import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([
    // January
    {
      id: 'jan1',
      category: 'Freelance',
      amount: 800.00,
      date: 'January 5, 2024',
      description: 'Website development project'
    },
    {
      id: 'jan2',
      category: 'Groceries',
      amount: 150.50,
      date: 'January 10, 2024',
      description: 'Monthly groceries'
    },

    // February
    {
      id: 'feb1',
      category: 'Online Sale',
      amount: 300.00,
      date: 'February 3, 2024',
      description: 'Sold unused electronics'
    },
    {
      id: 'feb2',
      category: 'Insurance',
      amount: 180.00,
      date: 'February 15, 2024',
      description: 'Car insurance'
    },

    // March
    {
      id: 'mar1',
      category: 'Freelance',
      amount: 1200.00,
      date: 'March 7, 2024',
      description: 'Mobile app development'
    },
    {
      id: 'mar2',
      category: 'Shopping',
      amount: 250.00,
      date: 'March 12, 2024',
      description: 'New clothes'
    },

    // April
    {
      id: 'apr1',
      category: 'Online Sale',
      amount: 450.00,
      date: 'April 4, 2024',
      description: 'Sold furniture'
    },
    {
      id: 'apr2',
      category: 'Utilities',
      amount: 95.00,
      date: 'April 15, 2024',
      description: 'Electricity bill'
    },

    // May (existing transactions)
    {
      id: '1',
      category: 'Groceries',
      amount: 120.50,
      date: 'May 2, 2024',
      description: 'Weekly grocery shopping'
    },
    {
      id: '2',
      category: 'Utilities',
      amount: 85.00,
      date: 'May 5, 2024',
      description: 'Electricity bill'
    },
    {
      id: '3',
      category: 'Transport',
      amount: 45.75,
      date: 'May 7, 2024',
      description: 'Fuel'
    },
    {
      id: '4',
      category: 'Dining',
      amount: 60.25,
      date: 'May 10, 2024',
      description: 'Dinner with friends'
    },
    {
      id: '5',
      category: 'Freelance',
      amount: 500.00,
      date: 'May 11, 2024',
      description: 'Website design payment'
    },
    {
      id: '6',
      category: 'Internet',
      amount: 90.00,
      date: 'May 12, 2024',
      description: 'Monthly internet subscription'
    },
    {
      id: '7',
      category: 'Movie',
      amount: 35.00,
      date: 'May 15, 2024',
      description: 'Cinema tickets'
    },
    {
      id: '8',
      category: 'Online Sale',
      amount: 150.00,
      date: 'May 16, 2024',
      description: 'Amazon purchase'
    },
    {
      id: '9',
      category: 'Shopping',
      amount: 200.00,
      date: 'May 18, 2024',
      description: 'New clothes'
    },
    {
      id: '10',
      category: 'Petrol',
      amount: 70.00,
      date: 'May 20, 2024',
      description: 'Fuel'
    },
    {
      id: '11',
      category: 'Insurance',
      amount: 180.00,
      date: 'May 22, 2024',
      description: 'Car insurance'
    }
  ]);

  const selectedMonth = ref('May');

  function setSelectedMonth(month) {
    selectedMonth.value = month;
  }

  function addTransaction(transaction) {
    transactions.value.push(transaction);
  }

  function updateTransaction(updatedTransaction) {
    const index = transactions.value.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      transactions.value[index] = updatedTransaction;
    }
  }

  function deleteTransaction(id) {
    transactions.value = transactions.value.filter(t => t.id !== id);
  }

  function getTransactionsByMonth(month) {
    return transactions.value.filter(t => t.date.includes(month));
  }

  function getTotalByMonth(month) {
    return getTransactionsByMonth(month).reduce((sum, t) => sum + t.amount, 0);
  }

  function getTotal() {
    return transactions.value.reduce((sum, t) => sum + t.amount, 0);
  }

  function getAverage() {
    if (transactions.value.length === 0) return 0;
    return getTotal() / transactions.value.length;
  }

  function getHighest() {
    if (transactions.value.length === 0) return 0;
    return Math.max(...transactions.value.map(t => t.amount));
  }

  return {
    transactions,
    selectedMonth,
    setSelectedMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getTotalByMonth,
    getTotal,
    getAverage,
    getHighest
  };
});
