<template>
  <div class="container">
    <h2>Ausgabenübersicht</h2>

    <!-- FILTER -->
    <div class="filter">
      <label>Kategorie:</label>
      <select v-model="selectedKategorie" @change="applyFilter">
        <option value="">Alle</option>
        <option value="LEBENSMITTEL">Lebensmittel</option>
        <option value="KLEIDUNG">Kleidung</option>
        <option value="FAHRTKOSTEN">Fahrtkosten</option>
        <option value="MIETE">Miete</option>
        <option value="FREIZEIT">Freizeit</option>
        <option value="GESUNDHEIT">Gesundheit</option>
        <option value="SONSTIGES">Sonstiges</option>
      </select>

      <label>Datum:</label>
      <input type="date" v-model="selectedDate" @change="applyFilter" />
    </div>

    <!-- LISTE -->
    <ul v-if="expenses.length">
      <li v-for="expense in expenses" :key="expense.id" class="expense-item">
        <div>
          <strong>💰 {{ expense.betrag }} €</strong><br>
          Kategorie: {{ beautify(expense.verwendungszweck) }}<br>
          Zahlungsart: {{ beautify(expense.zahlungsart) }}<br>
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
export default {
  name: "AusgabenListe",

  data() {
    return {
      expenses: [],          // Die Liste der Ausgaben
      selectedKategorie: "", // Die aktuell ausgewählte Kategorie
      selectedDate: ""       // Das aktuell ausgewählte Datum
    };
  },

  mounted() {
    this.fetchExpenses();  // Initiale Ausgaben laden
  },

  methods: {
    // STRING → schöner Text für die Darstellung von Enum-Werten
    beautify(value) {
      if (!value) return "—";
      return value
          .toLowerCase()
          .replace(/_/g, " ")    // Unterstriche durch Leerzeichen ersetzen
          .replace(/\b\w/g, c => c.toUpperCase()); // Erstes Zeichen jedes Wortes großschreiben
    },

    // Alle Ausgaben laden
    fetchExpenses() {
      fetch("https://cashflow-6.onrender.com/auszahlungen")
          .then(res => res.json())
          .then(data => {
            this.expenses = data; // Setzt die erhaltenen Daten in die expenses-Variable
          })
          .catch(err => console.error("Fehler beim Laden:", err)); // Fehlerbehandlung
    },

    // Kombinierter Filter (Kategorie + Datum)
    applyFilter() {
      let url = "https://cashflow-6.onrender.com/auszahlungen";

      // Wenn beide Filter gesetzt sind (Kategorie und Datum)
      if (this.selectedKategorie && this.selectedDate) {
        url += `?kategorie=${this.selectedKategorie}&datum=${this.selectedDate}`;
      }
      // Wenn nur das Datum gesetzt ist
      else if (this.selectedDate) {
        url += `?datum=${this.selectedDate}`;
      }
      // Wenn nur die Kategorie gesetzt ist
      else if (this.selectedKategorie) {
        url += `?kategorie=${this.selectedKategorie}`;
      }

      // API-Aufruf mit den dynamischen Filterparametern
      fetch(url)
          .then(res => res.json())
          .then(data => {
            this.expenses = data; // Setzt die gefilterten Daten in die expenses-Variable
          })
          .catch(err => console.error("Fehler beim Filtern:", err)); // Fehlerbehandlung
    },

    // Löschen einer Ausgabe
    deleteTransaction(id) {
      fetch(`https://cashflow-6.onrender.com/auszahlungen/${id}`, {
        method: "DELETE"
      })
          .then(res => {
            if (res.ok) {
              this.applyFilter(); // Filter nach Löschen beibehalten
            } else {
              alert("Fehler beim Löschen");
            }
          })
          .catch(err => console.error("Fehler beim Löschen:", err)); // Fehlerbehandlung
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 720px;
  margin: 0 auto;
}

.filter {
  display: flex;
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
