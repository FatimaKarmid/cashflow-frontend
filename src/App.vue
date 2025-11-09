<template>
  <div id="app">
    <h1>Cashflow App</h1>
    <ExpenseList />
  </div>
</template>

<script>
import ExpenseList from './components/ExpenseList.vue'

export default {
  components: { ExpenseList }
}
</script>

<style scoped>
h1 {
  color: #333;
}
</style>
