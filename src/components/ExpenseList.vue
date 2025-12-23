<template>
  <div class="container">
    <h2>Ausgabenübersicht</h2>

    <!-- FILTER -->
    <div class="filter">
      <label for="kategorie">Kategorie filtern:</label>
      <select id="kategorie" v-model="selectedKategorie" @change="filterExpenses">
        <option value="">Alle</option>
        <option value="LEBENSMITTEL">Lebensmittel</option>
        <option value="KLEIDUNG">Kleidung</option>
        <option value="FAHRTKOSTEN">Fahrtkosten</option>
        <option value="MIETE">Miete</option>
        <option value="FREIZEIT">Freizeit</option>
        <option value="GESUNDHEIT">Gesundheit</option>
        <option value="SONSTIGES">Sonstiges</option>
      </select>
    </div>

    <!-- LISTE -->
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
      expenses: [],
      selectedKategorie: ""
    };
  },
  mounted() {
    this.fetchExpenses();
  },
  methods: {
    // Zahl → Text
    verwendungszweckText(value) {
      return verwendungszweckMap[value] || "Unbekannt";
    },

    // Alle laden
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

    // Filter nach Kategorie
    filterExpenses() {
      if (!this.selectedKategorie) {
        this.fetchExpenses();
        return;
      }

      fetch(`https://cashflow-6.onrender.com/auszahlungen/filter?kategorie=${this.selectedKategorie}`)
          .then(response => response.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(error =>
              console.error('Fehler beim Filtern:', error)
          );
    },

    // Löschen
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

.filter {
  margin-bottom: 20px;
}

select {
  padding: 6px;
  margin-left: 10px;
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
