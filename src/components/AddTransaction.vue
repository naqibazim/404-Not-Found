<template>
  <button class="add-transaction" @click="$emit('click')">
    <svg viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    <span>Add Transaction</span>
  </button>
</template>

<script>
export default {
  name: 'AddTransaction',
  emits: ['click']
}
</script>

<style scoped>
.add-transaction {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-transaction:hover {
  background: #0ea371;
}

.add-transaction svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>