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
        <option>Lebensmittel</option>
        <option>Kleidung</option>
        <option>Fahrtkosten</option>
        <option>Miete</option>
        <option>Freizeit</option>
        <option>Gesundheit</option>
        <option>Sonstiges</option>
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

      <button type="submit" :disabled="loading">
        {{ loading ? "Speichern..." : "Ausgabe speichern" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "AusgabeHinzufuegen",
  data() {
    return {
      loading: false,
      error: null,
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
      this.error = null;
      this.loading = true;

      const categoryMap = {
        Lebensmittel: 1,
        Kleidung: 2,
        Fahrtkosten: 3,
        Miete: 4,
        Freizeit: 5,
        Gesundheit: 6,
        Sonstiges: 7
      };

      fetch("https://cashflow-6.onrender.com/auszahlungen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          betrag: this.newTransaction.amount,
          datum: this.newTransaction.date,
          zahlungsart: 1, // KARTE
          verwendungszweck: categoryMap[this.newTransaction.category],
          notiz: this.newTransaction.note
        })
      })
          .then(async response => {
            const text = await response.text();
            if (!response.ok) {
              throw new Error(text || "Fehler beim Speichern");
            }
            return text;
          })
          .then(() => {
            alert("✅ Ausgabe erfolgreich gespeichert");
            this.newTransaction = {
              amount: null,
              category: "Lebensmittel",
              date: "",
              note: ""
            };
          })
          .catch(err => {
            console.error(err);
            this.error = err.message;
          })
          .finally(() => {
            this.loading = false;
          });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 420px;
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

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 12px;
  color: #e74c3c;
  font-weight: 600;
}
</style>
