<template>
  <div class="container">
    <h2>Neue Ausgabe hinzufügen</h2>

    <form @submit.prevent="submitTransaction">
      <!-- BETRAG -->
      <label for="betrag">Betrag (€)</label>
      <input
          type="number"
          id="betrag"
          v-model.number="newTransaction.amount"
          min="0.01"
          step="0.01"
          required
      />

      <!-- KATEGORIE -->
      <label for="verwendungszweck">Kategorie</label>
      <select
          id="verwendungszweck"
          v-model="newTransaction.category"
          required
      >
        <option value="LEBENSMITTEL">Lebensmittel</option>
        <option value="KLEIDUNG">Kleidung</option>
        <option value="FAHRTKOSTEN">Fahrtkosten</option>
        <option value="MIETE">Miete</option>
        <option value="FREIZEIT">Freizeit</option>
        <option value="GESUNDHEIT">Gesundheit</option>
        <option value="SONSTIGES">Sonstiges</option>
      </select>

      <!-- ZAHLUNGSART -->
      <label for="zahlungsart">Zahlungsart</label>
      <select
          id="zahlungsart"
          v-model="newTransaction.payment"
          required
      >
        <option value="BAR">Bar</option>
        <option value="KARTE">Karte</option>
        <option value="UEBERWEISUNG">Überweisung</option>
        <option value="LASTSCHRIFT">Lastschrift</option>
        <option value="SONSTIGES">Sonstiges</option>
      </select>

      <!-- DATUM -->
      <label for="datum">Datum</label>
      <input
          type="date"
          id="datum"
          v-model="newTransaction.date"
          required
      />

      <!-- NOTIZ -->
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
        category: "LEBENSMITTEL",
        payment: "KARTE",
        date: "",
        note: ""
      }
    };
  },

  methods: {
    submitTransaction() {
      this.error = null;
      this.loading = true;

      fetch("https://cashflow-6.onrender.com/auszahlungen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          betrag: this.newTransaction.amount,
          datum: this.newTransaction.date,
          zahlungsart: this.newTransaction.payment,
          verwendungszweck: this.newTransaction.category,
          notiz: this.newTransaction.note
        })
      })
          .then(async response => {
            if (!response.ok) {
              const msg = await response.text();
              throw new Error(msg || "Fehler beim Speichern");
            }
            return response.json();
          })
          .then(() => {
            alert("✅ Ausgabe erfolgreich gespeichert");
            this.newTransaction = {
              amount: null,
              category: "LEBENSMITTEL",
              payment: "KARTE",
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
