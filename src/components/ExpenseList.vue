<template>
  <div class="container">
    <h2>Ausgabenübersicht</h2>

    <!-- FILTER -->
    <div class="filter">
      <label>Name:</label>
      <input
          type="text"
          v-model="searchName"
          placeholder="Suchen..."
          @input="applyFilter"
      />

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

      <button class="reset-btn" @click="resetFilter">
        Zurücksetzen
      </button>
    </div>

    <!-- LISTE -->
    <ul>
      <li
          v-for="expense in expenses"
          :key="expense.id"
          class="expense-item"
      >
        <!-- VIEW -->
        <div v-if="editId !== expense.id">
          <strong>💰 {{ expense.betrag }} €</strong><br />
          Name: {{ expense.name }}<br />
          Kategorie: {{ beautify(expense.verwendungszweck) }}<br />
          Zahlungsart: {{ beautify(expense.zahlungsart) }}<br />
          Datum: {{ expense.datum }}<br />
          <span v-if="expense.notiz">Notiz: {{ expense.notiz }}</span>
        </div>

        <!-- EDIT -->
        <div v-else>
          <input v-model="editExpense.name" />
          <input type="number" v-model.number="editExpense.betrag" />
          <input type="date" v-model="editExpense.datum" />
        </div>

        <!-- ACTIONS -->
        <div class="actions">
          <button v-if="editId !== expense.id" @click="startEdit(expense)">
            Bearbeiten
          </button>

          <button v-else @click="saveEdit">
            Speichern
          </button>

          <button class="delete-btn" @click="deleteTransaction(expense.id)">
            Löschen
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const API_URL = import.meta.env.VITE_API_URL;

export default {
  name: "AusgabenListe",

  data() {
    return {
      expenses: [],
      selectedKategorie: "",
      selectedDate: "",
      searchName: "",
      editId: null,
      editExpense: {}
    };
  },

  mounted() {
    this.fetchExpenses();
  },

  methods: {
    beautify(value) {
      return value
          ? value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
          : "—";
    },

    //  Alle Ausgaben laden
    fetchExpenses() {
      fetch(`${API_URL}/auszahlungen`)
          .then(res => res.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(err => {
            console.error("Fehler beim Laden:", err);
            this.expenses = [];
          });
    },

    //  Zentrale Filterfunktion (alle Kombinationen)
    applyFilter() {
      const params = new URLSearchParams();

      if (this.searchName) params.append("name", this.searchName);
      if (this.selectedKategorie) params.append("kategorie", this.selectedKategorie);
      if (this.selectedDate) params.append("datum", this.selectedDate);

      fetch(`${API_URL}/auszahlungen/filter?${params}`)
          .then(res => res.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(err => {
            console.error("Fehler beim Filtern:", err);
            this.expenses = [];
          });
    },

    //  Reset
    resetFilter() {
      this.searchName = "";
      this.selectedKategorie = "";
      this.selectedDate = "";
      this.fetchExpenses();
    },

    //  Delete
    deleteTransaction(id) {
      fetch(`${API_URL}/auszahlungen/${id}`, { method: "DELETE" })
          .then(() => {
            this.expenses = this.expenses.filter(e => e.id !== id);
          })
          .catch(err => {
            console.error("Fehler beim Löschen:", err);
          });
    },

    //  Edit
    startEdit(expense) {
      this.editId = expense.id;
      this.editExpense = { ...expense };
    },

    //  Save
    saveEdit() {
      fetch(`${API_URL}/auszahlungen/${this.editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.editExpense)
      })
          .then(() => {
            this.editId = null;
            this.fetchExpenses();
          })
          .catch(err => {
            console.error("Fehler beim Speichern:", err);
          });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 760px;
  margin: 0 auto;
}

.filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  background: white;
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
}
</style>
