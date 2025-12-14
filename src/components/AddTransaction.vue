<template>
  <div>
    <h2>Neue Ausgabe hinzufügen</h2>
    <form @submit.prevent="submitTransaction">
      <label for="betrag">Betrag:</label>
      <input type="number" v-model="newTransaction.amount" id="betrag" required />

      <label for="verwendungszweck">Kategorie:</label>
      <select v-model="newTransaction.category" id="verwendungszweck" required>
        <option value="Lebensmittel">Lebensmittel</option>
        <option value="Kleidung">Kleidung</option>
        <option value="Fahrtkosten">Fahrtkosten</option>
        <option value="Miete">Miete</option>
        <option value="Freizeit">Freizeit</option>
        <option value="Gesundheit">Gesundheit</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>

      <label for="datum">Datum:</label>
      <input type="date" v-model="newTransaction.date" id="datum" required />

      <label for="notiz">Notiz:</label>
      <textarea v-model="newTransaction.note" id="notiz"></textarea>

      <button type="submit">Hinzufügen</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      newTransaction: {
        amount: null,
        category: 'Lebensmittel', // Standardwert für Kategorie
        date: '',
        note: ''
      }
    };
  },
  methods: {
    submitTransaction() {
      const categoryMap = {
        "Lebensmittel": 1,
        "Kleidung": 2,
        "Fahrtkosten": 3,
        "Miete": 4,
        "Freizeit": 5,
        "Gesundheit": 6,
        "Sonstiges": 7
      };

      const zahlungsartMap = {
        "BAR": 1,
        "KARTE": 2,
        "ÜBERWEISUNG": 3,
        "LASTSCHRIFT": 4,
        "SONSTIGES": 5
      };

      fetch('https://cashflow-6.onrender.com/auszahlungen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          betrag: this.newTransaction.amount,
          datum: this.newTransaction.date,
          zahlungsart: zahlungsartMap["KARTE"],  // Hier wird der Integer-Wert verwendet (für jetzt statisch auf "KARTE" gesetzt)
          verwendungszweck: categoryMap[this.newTransaction.category],
          notiz: this.newTransaction.note
        })
      })
          .then(response => response.json())
          .then(data => {
            alert('Transaktion hinzugefügt');
            this.newTransaction = { amount: null, category: 'Lebensmittel', date: '', note: '' };  // Formular zurücksetzen
          })
          .catch(error => console.error('Fehler beim Hinzufügen der Transaktion:', error));
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
