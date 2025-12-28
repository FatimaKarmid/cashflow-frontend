<template>
  <div class="container">
    <h2>Dashboard</h2>

    <div class="dashboard-grid">

      <!-- SUMME PRO TAG -->
      <div class="card">
        <h3>Ausgaben pro Tag</h3>
        <input type="date" v-model="selectedDate" @change="loadTagSumme" />
        <p class="amount">{{ tagSumme }} €</p>
      </div>

      <!-- SUMME PRO MONAT -->
      <div class="card">
        <h3>Ausgaben pro Monat</h3>

        <div class="row">
          <input type="number" min="1" max="12" v-model.number="monat" />
          <input type="number" v-model.number="jahr" />
        </div>

        <button @click="loadMonatDaten">
          Berechnen
        </button>

        <p class="amount">{{ monatSumme }} €</p>
      </div>

      <!-- CHART -->
      <div class="card">
        <h3>Ausgaben nach Kategorie</h3>

        <p v-if="!chartDataLoaded" class="hint">
          Monat auswählen und berechnen
        </p>

        <canvas v-show="chartDataLoaded" ref="chart"></canvas>
      </div>

    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";

export default {
  name: "Dashboard",

  data() {
    return {
      selectedDate: "",
      tagSumme: 0,

      monat: new Date().getMonth() + 1,
      jahr: new Date().getFullYear(),
      monatSumme: 0,

      chart: null,
      chartDataLoaded: false
    };
  },

  mounted() {
    // Optional: direkt Monatsdaten laden
    this.loadMonatDaten();
  },

  methods: {
    // ========= HILFSFUNKTION =========
    beautify(text) {
      return text
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase());
    },

    // ========= TAG =========
    loadTagSumme() {
      if (!this.selectedDate) return;

      fetch(
          `https://cashflow-6.onrender.com/auszahlungen/summe?datum=${this.selectedDate}`
      )
          .then(res => res.json())
          .then(data => {
            this.tagSumme = data;
          })
          .catch(() => {
            this.tagSumme = 0;
          });
    },

    // ========= MONAT + CHART =========
    loadMonatDaten() {
      this.chartDataLoaded = false;

      // Summe pro Monat
      fetch(
          `https://cashflow-6.onrender.com/auszahlungen/summe-monat?monat=${this.monat}&jahr=${this.jahr}`
      )
          .then(res => res.json())
          .then(data => {
            this.monatSumme = data;
          });

      // Chart-Daten
      fetch(
          `https://cashflow-6.onrender.com/auszahlungen/chart?monat=${this.monat}&jahr=${this.jahr}`
      )
          .then(res => res.json())
          .then(data => {
            this.loadChart(data);
            this.chartDataLoaded = true;
          })
          .catch(() => {
            this.chartDataLoaded = false;
          });
    },

    // ========= CHART =========
    loadChart(data) {
      const ctx = this.$refs.chart;

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(data).map(this.beautify),
          datasets: [
            {
              data: Object.values(data),
              backgroundColor: [
                "#42b983",
                "#3498db",
                "#f39c12",
                "#9b59b6",
                "#e74c3c",
                "#1abc9c",
                "#95a5a6"
              ]
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom"
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.amount {
  font-size: 28px;
  font-weight: bold;
  color: #42b983;
  margin-top: 10px;
}

.row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input {
  padding: 8px;
  font-size: 1rem;
}

button {
  padding: 8px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
}

.hint {
  color: #888;
  font-size: 0.9rem;
}
</style>
