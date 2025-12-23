<template>
  <div class="container">
    <h2>Dashboard</h2>

    <label>Datum auswählen:</label>
    <input type="date" v-model="selectedDate" @change="loadSumme" />

    <div class="card">
      <h3>Gesamtausgaben am Tag</h3>
      <p class="amount">{{ summe }} €</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      selectedDate: "",
      summe: 0
    };
  },
  methods: {
    loadSumme() {
      if (!this.selectedDate) return;

      fetch(
          `https://cashflow-6.onrender.com/auszahlungen/summe?datum=${this.selectedDate}`
      )
          .then(response => response.json())
          .then(data => {
            this.summe = data;
          })
          .catch(err =>
              console.error("Fehler beim Laden der Summe:", err)
          );
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
}

.card {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.amount {
  font-size: 28px;
  font-weight: bold;
  color: #42b983;
}
</style>
