<template>
  <div class="container">
    <h2>Dashboard</h2>

    <div class="dashboard-grid">

      <!-- SUMME PRO TAG -->
      <div class="card">
        <h3>Ausgaben pro Tag</h3>

        <input
            type="date"
            class="date-input"
            v-model="selectedDate"
            @change="loadTagSumme"
        />

        <p class="amount">{{ tagSumme }} €</p>
      </div>

      <!-- SUMME PRO MONAT -->
      <div class="card">
        <h3>Ausgaben pro Monat</h3>

        <div class="row">
          <input
              type="number"
              min="1"
              max="12"
              v-model.number="monat"
              class="month-input"
              placeholder="MM"
          />

          <input
              type="number"
              min="2000"
              max="2100"
              v-model.number="jahr"
              class="year-input"
              placeholder="YYYY"
          />
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

const API_URL = import.meta.env.VITE_API_URL;

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
    this.loadMonatDaten(); // lädt die monatliche Summe bei der Initialisierung
  },

  methods: {
    beautify(text) {
      return text
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase());
    },

    // Lädt die Summe der Ausgaben für den ausgewählten Tag
    loadTagSumme() {
      if (!this.selectedDate) {
        this.tagSumme = 0;
        return;
      }

      fetch(`${API_URL}/auszahlungen/summe?datum=${this.selectedDate}`)
          .then(res => res.json())
          .then(data => {
            this.tagSumme = data;
          })
          .catch(err => {
            console.error("Fehler beim Laden der Tagesausgaben:", err);
            this.tagSumme = 0;
          });
    },

    // Lädt die Summe der Ausgaben und das Diagramm für den gewählten Monat/Jahr
    loadMonatDaten() {
      if (!this.monat || !this.jahr) {
        console.error("Ungültiger Monat oder Jahr");
        return;
      }

      this.chartDataLoaded = false;

      // Monatliche Summe der Ausgaben
      fetch(`${API_URL}/auszahlungen/summe-monat?monat=${this.monat}&jahr=${this.jahr}`)
          .then(res => res.json())
          .then(data => {
            this.monatSumme = data;
          })
          .catch(err => {
            console.error("Fehler beim Laden der Monatsausgaben:", err);
            this.monatSumme = 0;
          });

      // Diagrammdaten für den Monat
      fetch(`${API_URL}/auszahlungen/chart?monat=${this.monat}&jahr=${this.jahr}`)
          .then(res => res.json())
          .then(data => {
            this.loadChart(data);
            this.chartDataLoaded = true;
          })
          .catch(err => {
            console.error("Fehler beim Laden der Diagrammdaten:", err);
            this.chartDataLoaded = false;
          });
    },

    // Lädt das Diagramm basierend auf den erhaltenen Daten
    loadChart(data) {
      const ctx = this.$refs.chart;

      if (this.chart) {
        this.chart.destroy(); // Zerstört das alte Diagramm, um ein neues zu erstellen
      }

      // Neues Diagramm erstellen
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
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

/* 🎯 KLEINE, SAUBERE INPUTS */
.month-input {
  width: 60px;
  padding: 8px;
  font-size: 1rem;
  text-align: center;
}

.year-input {
  width: 80px;
  padding: 8px;
  font-size: 1rem;
  text-align: center;
}

.date-input {
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
