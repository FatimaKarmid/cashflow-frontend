<template>
  <div>
    <h2>Ausgabenübersicht</h2>
    <ul>
      <li v-for="expense in expenses" :key="expense.id">
        💰 {{ expense.betrag }} € – {{ expense.verwendungszweck }} am {{ expense.datum }}
      </li>
    </ul>

    <h2>Neue Ausgabe hinzufügen</h2>
    <form @submit.prevent="submitTransaction">
      <label for="betrag">Betrag:</label>
      <input type="number" id="betrag" v-model="newTransaction.betrag" required />

      <label for="verwendungszweck">Kategorie:</label>
      <select id="verwendungszweck" v-model="newTransaction.verwendungszweck" required>
        <option value="Lebensmittel">Lebensmittel</option>
        <option value="Kleidung">Kleidung</option>
        <option value="Fahrtkosten">Fahrtkosten</option>
        <option value="Miete">Miete</option>
        <option value="Freizeit">Freizeit</option>
        <option value="Gesundheit">Gesundheit</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>

      <label for="datum">Datum:</label>
      <input type="date" id="datum" v-model="newTransaction.datum" required />

      <label for="notiz">Notiz:</label>
      <textarea id="notiz" v-model="newTransaction.notiz"></textarea>

      <button type="submit">Hinzufügen</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      expenses: [], // Für die Liste der Ausgaben
      newTransaction: {
        betrag: null,
        verwendungszweck: "Lebensmittel",
        datum: "",
        notiz: ""
      }
    };
  },
  mounted() {
    this.fetchExpenses(); // Initiale Ausgaben laden
  },
  methods: {
    // Holt alle Ausgaben
    fetchExpenses() {
      fetch('https://cashflow-6.onrender.com/auszahlungen')
          .then(response => response.json())
          .then(data => {
            this.expenses = data;
          })
          .catch(error => console.error('Fehler beim Laden der Ausgaben:', error));
    },
    // Schickt die neue Transaktion ans Backend
    submitTransaction() {
      fetch('https://cashflow-6.onrender.com/auszahlungen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newTransaction)
      })
          .then(response => response.json())
          .then(data => {
            alert('Transaktion hinzugefügt!');
            this.fetchExpenses(); // Nach dem Hinzufügen die Ausgaben neu laden
            this.newTransaction = { betrag: null, verwendungszweck: "Lebensmittel", datum: "", notiz: "" }; // Formular zurücksetzen
          })
          .catch(error => {
            console.error('Fehler beim Hinzufügen der Transaktion:', error);
          });
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
}
input, select, textarea {
  margin: 8px 0;
  padding: 10px;
  font-size: 1rem;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
