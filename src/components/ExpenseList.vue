<template>
  <div class="container">
    <h2>Ausgabenübersicht</h2>

    <ul v-if="expenses.length">
      <li v-for="expense in expenses" :key="expense.id" class="expense-item">
        <div>
          <strong>💰 {{ expense.betrag }} €</strong><br>
          Kategorie: {{ verwendungszweckText(expense.verwendungszweck) }}<br>
          Datum: {{ expense.datum }}<br>
          <span v-if="expense.notiz">Notiz: {{ expense.notiz }}</span>
        </div>

        <button class="delete-btn" @click="deleteTransaction(expense.id)">
          Löschen
        </button>
      </li>
    </ul>

    <p v-else>Keine Ausgaben vorhanden.</p>
  </div>
</template>

<script>
// Mapping: Integer aus Backend → lesbarer Text
const verwendungszweckMap = {
  1: "Lebensmittel",
  2: "Kleidung",
  3: "Fahrtkosten",
  4: "Miete",
  5: "Freizeit",
  6: "Gesundheit",
  7: "Sonstiges"
};

export default {
  name: 'AusgabenListe',
  data() {
    return {
      expenses: []
    };
  },
  mounted() {
    this.fetchExpenses();
  },
  methods: {
    // Wandelt Zahl in Text um
    verwendungszweckText(value) {
      return verwendungszweckMap[value] || "Unbekannt";
    },

    fetchExpenses() {
      fetch('https://cashflow-6.onrender.com/auszahlungen')
          .then(response => response.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(error =>
              console.error('Fehler beim Laden der Ausgaben:', error)
          );
    },

    deleteTransaction(id) {
      fetch(`https://cashflow-6.onrender.com/auszahlungen/${id}`, {
        method: 'DELETE'
      })
          .then(response => {
            if (response.ok) {
              this.fetchExpenses();
            } else {
              alert('Fehler beim Löschen');
            }
          })
          .catch(error =>
              console.error('Fehler beim Löschen der Ausgabe:', error)
          );
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
}

ul {
  list-style: none;
  padding: 0;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
