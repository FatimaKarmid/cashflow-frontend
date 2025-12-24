<template>
  <div class="container">
    <h2>Ausgabenübersicht</h2>

    <!-- FILTER -->
    <div class="filter">
      <label for="kategorie">Kategorie:</label>
      <select id="kategorie" v-model="selectedKategorie" @change="applyFilter">
        <option value="">Alle</option>
        <option value="LEBENSMITTEL">Lebensmittel</option>
        <option value="KLEIDUNG">Kleidung</option>
        <option value="FAHRTKOSTEN">Fahrtkosten</option>
        <option value="MIETE">Miete</option>
        <option value="FREIZEIT">Freizeit</option>
        <option value="GESUNDHEIT">Gesundheit</option>
        <option value="SONSTIGES">Sonstiges</option>
      </select>

      <label for="datum">Datum:</label>
      <input id="datum" type="date" v-model="selectedDate" @change="applyFilter" />
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
  name: "AusgabenListe",
  data() {
    return {
      expenses: [],
      selectedKategorie: "",
      selectedDate: ""
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
      fetch("https://cashflow-6.onrender.com/auszahlungen")
          .then(res => res.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(err =>
              console.error("Fehler beim Laden der Ausgaben:", err)
          );
    },

    // Kombinierter Filter
    applyFilter() {
      // Priorität: Datum > Kategorie
      let url = "https://cashflow-6.onrender.com/auszahlungen";

      if (this.selectedDate) {
        url = `${url}?datum=${this.selectedDate}`;
      } else if (this.selectedKategorie) {
        url = `${url}/filter?kategorie=${this.selectedKategorie}`;
      }

      fetch(url)
          .then(res => res.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(err =>
              console.error("Fehler beim Filtern:", err)
          );
    },

    // Löschen
    deleteTransaction(id) {
      fetch(`https://cashflow-6.onrender.com/auszahlungen/${id}`, {
        method: "DELETE"
      })
          .then(response => {
            if (response.ok) {
              this.applyFilter(); // Filter beibehalten
            } else {
              alert("Fehler beim Löschen");
            }
          })
          .catch(err =>
              console.error("Fehler beim Löschen:", err)
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
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

select,
input {
  padding: 6px;
  font-size: 0.95rem;
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
