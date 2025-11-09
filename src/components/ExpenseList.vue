<template>
  <div>
    <h2>Ausgabenübersicht</h2>
    <ul>
      <li v-for="(expense, index) in expenses" :key="index">
        💰 {{ expense.amount }} € – {{ expense.category }} am {{ expense.date }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ExpenseList',
  data() {
    return {
      expenses: [
        { amount: 12.5, category: 'Lebensmittel', date: '2025-11-08' },
        { amount: 40, category: 'Kleidung', date: '2025-11-07' },
        { amount: 5, category: 'Fahrtkosten', date: '2025-11-06' }
      ]
    }
  }
}
</script>

<style scoped>
h2 {
  color: #42b983;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 6px 0;
}
</style>

