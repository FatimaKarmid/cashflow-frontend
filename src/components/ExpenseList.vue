<template>
  <div>
    <h2>Ausgabenübersicht</h2>
    <ul>
<<<<<<< HEAD
      <li v-for="(expense, index) in expenses" :key="index">
        💰 {{ expense.amount }} € – {{ expense.category }} am {{ expense.date }}
=======
      <li v-for="expense in expenses" :key="expense.id">
        💰 {{ expense.betrag }} € – {{ expense.verwendungszweck }} am {{ expense.datum }}
>>>>>>> 685e666 (Hinzufügt: Formular für neue Ausgaben)
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ExpenseList',
  data() {
    return {
<<<<<<< HEAD
      expenses: [
        { amount: 12.5, category: 'Lebensmittel', date: '2025-11-08' },
        { amount: 40, category: 'Kleidung', date: '2025-11-07' },
        { amount: 5, category: 'Fahrtkosten', date: '2025-11-06' }
      ]
    }
=======
      expenses: []
    };
  },
  mounted() {
    fetch('https://cashflow-6.onrender.com/auszahlungen')
        .then(response => response.json())
        .then(data => {
          this.expenses = data;
        })
        .catch(error => console.error('Fehler beim Laden der Ausgaben:', error));
>>>>>>> 685e666 (Hinzufügt: Formular für neue Ausgaben)
  }
}
</script>

<style scoped>
<<<<<<< HEAD
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

=======
ul {
  list-style: none;
  padding: 0;
  font-size: 18px;
}
</style>
>>>>>>> 685e666 (Hinzufügt: Formular für neue Ausgaben)
