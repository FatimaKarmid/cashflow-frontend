<template>
  <div class="container">
    <h2>Neue Ausgabe hinzufügen</h2>

    <form @submit.prevent="submitTransaction">
      <label for="betrag">Betrag (€)</label>
      <input
          type="number"
          id="betrag"
          v-model.number="newTransaction.amount"
          min="0.01"
          step="0.01"
          required
      />

      <label for="verwendungszweck">Kategorie</label>
      <select
          id="verwendungszweck"
          v-model="newTransaction.category"
          required
      >
        <option value="Lebensmittel">Lebensmittel</option>
        <option value="Kleidung">Kleidung</option>
        <option value="Fahrtkosten">Fahrtkosten</option>
        <option value="Miete">Miete</option>
        <option value="Freizeit">Freizeit</option>
        <option value="Gesundheit">Gesundheit</option>
        <option value="Sonstiges">Sonstiges</option>
      </select>

      <label for="datum">Datum</label>
      <input
          type="date"
          id="datum"
          v-model="newTransaction.date"
          required
      />

      <label for="notiz">Notiz</label>
      <textarea
          id="notiz"
          v-model="newTransaction.note"
          placeholder="Optional"
      ></textarea>

      <button type="submit">Ausgabe speichern</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AusgabeHinzufuegen",
  data() {
    return {
      newTransaction: {
        amount: null,
        category: "Lebensmittel",
        date: "",
        note: ""
      }
    };
  },
  methods: {
    submitTransaction() {
      const categoryMap = {
        Lebensmittel: 1,
        Kleidung: 2,
        Fahrtkosten: 3,
        Miete: 4,
        Freizeit: 5,
        Gesundheit: 6,
        Sonstiges: 7
      };

      const zahlungsartMap = {
        BAR: 1,
        KARTE: 2,
        UEBERWEISUNG: 3,
        LASTSCHRIFT: 4,
        SONSTIGES: 5
      };

      fetch("https://cashflow-6.onrender.com/auszahlungen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          betrag: this.newTransaction.amount,
          datum: this.newTransaction.date,
          zahlungsart: zahlungsartMap.KARTE,
          verwendungszweck: categoryMap[this.newTransaction.category],
          notiz: this.newTransaction.note
        })
      })
          .then(response => {
            if (!response.ok) {
              throw new Error("Fehler beim Speichern");
            }
            return response.json();
          })
          .then(() => {
            alert("Ausgabe erfolgreich gespeichert");
            this.newTransaction = {
              amount: null,
              category: "Lebensmittel",
              date: "",
              note: ""
            };
          })
          .catch(error =>
              console.error("Fehler beim Hinzufügen der Transaktion:", error)
          );
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 12px;
  font-weight: 600;
}

input,
select,
textarea {
  margin-top: 6px;
  padding: 10px;
  font-size: 1rem;
}

button {
  margin-top: 20px;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 6px;
}

button:hover {
  background-color: #369b6e;
}
</style>
