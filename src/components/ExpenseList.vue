<template>
  <div>
    <h2>Ausgabenübersicht</h2>
    <ul>
      <li v-for="expense in expenses" :key="expense.id">
        💰 {{ expense.betrag }} € – {{ expense.verwendungszweck }} am {{ expense.datum }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ExpenseList',
  data() {
    return {
      expenses: []  // Leere Liste, die später mit echten Daten gefüllt wird
    };
  },
  mounted() {
    // Hole die Auszahlungen vom Backend (API)
    fetch('https://cashflow-6.onrender.com/auszahlungen')
        .then(response => response.json())
        .then(data => {
          this.expenses = data;
        })
        .catch(error => console.error('Fehler beim Laden der Ausgaben:', error));
  }
}
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  font-size: 18px;
}
</style>
