<template>
  <div>
    <h2>Neue Auszahlung hinzufügen</h2>
    <form @submit.prevent="submitTransaction">
      <label for="amount">Betrag:</label>
      <input type="number" v-model="newTransaction.amount" id="amount" required />

      <label for="category">Kategorie:</label>
      <select v-model="newTransaction.category" id="category" required>
        <option value="Lebensmittel">Lebensmittel</option>
        <option value="Kleidung">Kleidung</option>
        <option value="Fahrtkosten">Fahrtkosten</option>
        <option value="Miete">Miete</option>
        <option value="Freizeit">Freizeit</option>
        <option value="Gesundheit">Gesundheit</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>

      <label for="date">Datum:</label>
      <input type="date" v-model="newTransaction.date" id="date" required />

      <label for="note">Notiz:</label>
      <textarea v-model="newTransaction.note" id="note"></textarea>

      <button type="submit">Hinzufügen</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTransaction: {
        amount: null,
        category: 'Lebensmittel',
        date: '',
        note: ''
      }
    };
  },
  methods: {
    submitTransaction() {
      fetch('https://cashflow-6.onrender.com/auszahlungen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          betrag: this.newTransaction.amount,
          datum: this.newTransaction.date,
          zahlungsart: "KARTE",
          verwendungszweck: this.newTransaction.category,
          notiz: this.newTransaction.note
        })
      })
          .then(response => response.json())
          .then(data => {
            alert('Transaktion hinzugefügt');
            this.newTransaction = { amount: null, category: 'Lebensmittel', date: '', note: '' };
          })
          .catch(error => console.error('Fehler beim Hinzufügen der Transaktion:', error));
    }
  }
};
</script>
