<template>
  <div id="app">
    <h1>Expense Tracker</h1>
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: {
    Dashboard
  }
}
</script>
