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
    <ul v-if="expenses.length">
      <li v-for="expense in expenses" :key="expense.id" class="expense-item">

        <!-- VIEW -->
        <div v-if="editId !== expense.id">
          <strong>💰 {{ expense.betrag }} €</strong><br>
          Name: {{ expense.name }}<br>
          Kategorie: {{ beautify(expense.verwendungszweck) }}<br>
          Zahlungsart: {{ beautify(expense.zahlungsart) }}<br>
          Datum: {{ expense.datum }}<br>
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

    <p v-else>Keine Ausgaben vorhanden.</p>
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

    fetchExpenses() {
      const BASE_URL=import.meta.env.VITE_API_URL
      fetch("${API_URL}/auszahlungen")
          .then(res => res.json())
          .then(data => (this.expenses = data));
    },

    applyFilter() {
      const params = new URLSearchParams();

      if (this.selectedKategorie) params.append("kategorie", this.selectedKategorie);
      if (this.selectedDate) params.append("datum", this.selectedDate);
      if (this.searchName) params.append("name", this.searchName);

      fetch(`${API_URL}/auszahlungen/filter?${params}`)
          .then(res => res.json())
          .then(data => (this.expenses = data));
    },

    resetFilter() {
      this.selectedKategorie = "";
      this.selectedDate = "";
      this.searchName = "";
      this.fetchExpenses();
    },

    deleteTransaction(id) {
      fetch(`${API_URL}/auszahlungen/${id}`, {
        method: "DELETE"
      }).then(() => this.applyFilter());
    },

    startEdit(expense) {
      this.editId = expense.id;
      this.editExpense = { ...expense };
    },

    saveEdit() {
      fetch(`${API_URL}/auszahlungen/${this.editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.editExpense)
      }).then(() => {
        this.editId = null;
        this.fetchExpenses();
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
