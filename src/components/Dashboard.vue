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

        <button @click="loadMonatDaten">Berechnen</button>

        <p class="amount">{{ monatSumme }} €</p>
      </div>

      <!-- CHART -->
      <div class="card">
        <h3>Ausgaben nach Kategorie</h3>
        <canvas ref="chart"></canvas>
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

      chart: null
    };
  },
  methods: {
    // TAG
    loadTagSumme() {
      if (!this.selectedDate) return;

      fetch(`https://cashflow-6.onrender.com/auszahlungen/summe?datum=${this.selectedDate}`)
          .then(res => res.json())
          .then(data => {
            this.tagSumme = data;
          });
    },

    // MONAT + CHART  ⬅️ HIER GEHÖRT DER CHART-FETCH HIN
    loadMonatDaten() {
      // Summe pro Monat
      fetch(`https://cashflow-6.onrender.com/auszahlungen/summe-monat?monat=${this.monat}&jahr=${this.jahr}`)
          .then(res => res.json())
          .then(data => {
            this.monatSumme = data;
          });

      // Chart-Daten
      fetch(`https://cashflow-6.onrender.com/auszahlungen/chart?monat=${this.monat}&jahr=${this.jahr}`)
          .then(res => res.json())
          .then(data => {
            this.loadChart(data);
          });
    },

    // Chart zeichnen
    loadChart(data) {
      const ctx = this.$refs.chart;

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(data),
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
        }
      });
    }
  }
};
</script>
