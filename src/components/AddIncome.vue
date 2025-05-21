<template>
  <div class="add-income-modal">
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <div class="modal-content">
      <h1>Add Transaction</h1>
      
      <div class="input-group">
        <label>NAME</label>
        <input v-model="name" placeholder="Transaction name">
      </div>
      
      <div class="input-group">
        <label>AMOUNT</label>
        <div class="amount-input">
          <span>$</span>
          <input v-model="amount" type="number" placeholder="0.00">
          <button class="clear-btn" @click="amount = ''">Clear</button>
        </div>
      </div>
      
      <div class="input-group">
        <label>DATE</label>
        <input type="date" v-model="date">
      </div>
      
      <div class="input-group">
        <label>TYPE</label>
        <select v-model="type">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      
      <div class="input-group" v-if="type === 'expense'">
        <label>CATEGORY</label>
        <select v-model="category">
          <option value="Food & Beverages">Food & Beverages</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Fashion">Fashion</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div class="divider"></div>
      
      <div class="keypad">
        <div class="keypad-row">
          <button @click="appendToAmount(1)">1</button>
          <button @click="appendToAmount(2)">2</button>
          <button @click="appendToAmount(3)">3</button>
        </div>
        <div class="keypad-row">
          <button @click="appendToAmount(4)">4</button>
          <button @click="appendToAmount(5)">5</button>
          <button @click="appendToAmount(6)">6</button>
        </div>
        <div class="keypad-row">
          <button @click="appendToAmount(7)">7</button>
          <button @click="appendToAmount(8)">8</button>
          <button @click="appendToAmount(9)">9</button>
        </div>
        <div class="keypad-row">
          <button class="wide-btn" @click="appendDecimal">.</button>
          <button @click="appendToAmount(0)">0</button>
          <button class="submit-btn" @click="submitTransaction">✅</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddIncome',
  emits: ['add-income', 'close'],
  data() {
    return {
      name: '',
      amount: '',
      date: new Date().toISOString().split('T')[0], // Default to today
      type: 'expense',
      category: 'Food & Beverages'
    }
  },
  methods: {
    appendToAmount(num) {
      this.amount += num.toString()
    },
    appendDecimal() {
      if (!this.amount.includes('.')) {
        this.amount += '.'
      }
    },
    submitTransaction() {
      if (!this.name || !this.amount) return
      
      this.$emit('add-income', {
        name: this.name,
        amount: parseFloat(this.amount),
        date: this.date,
        type: this.type,
        category: this.type === 'income' ? 'Income' : this.category
      })
      
      // Reset form
      this.name = ''
      this.amount = ''
      this.date = new Date().toISOString().split('T')[0]
      this.type = 'expense'
      this.category = 'Food & Beverages'
    }
  }
}
</script>

<style scoped>
.add-income-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  z-index: 1001;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #111827;
}

.input-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
}

input[type="date"] {
  appearance: none;
}

.amount-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-input span {
  font-size: 16px;
  color: #111827;
}

.clear-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
}

.keypad {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.keypad-row {
  display: flex;
  gap: 12px;
}

.keypad-row button {
  flex: 1;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 24px;
  cursor: pointer;
  position: relative;
}

.wide-btn {
  flex: 2 !important;
}

.submit-btn {
  background: #10b981 !important;
  color: white !important;
}
</style>