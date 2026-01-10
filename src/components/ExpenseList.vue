<template>
  <div class="container">
    <h2>Ausgabenübersicht</h2>

    <!-- FILTER -->
    <div class="filter">
      <label>Kategorie:</label>
      <select v-model="selectedKategorie" @change="applyFilter">
        <option value="">Alle</option>
        <option value="LEBENSMITTEL">Lebensmittel</option>
        <option value="KLEIDUNG">Kleidung</option>
        <option value="FAHRTKOSTEN">Fahrtkosten</option>
        <option value="MIETE">Miete</option>
        <option value="FREIZEIT">Freizeit</option>
        <option value="GESUNDHEIT">Gesundheit</option>
        <option value="SONSTIGES">Sonstiges</option>
      </select>

      <label>Datum:</label>
      <input type="date" v-model="selectedDate" @change="applyFilter" />
    </div>

    <!-- LISTE -->
    <ul v-if="expenses.length">
      <li
          v-for="expense in expenses"
          :key="expense.id"
          class="expense-item"
      >
        <div>
          <strong>💰 {{ expense.betrag }} €</strong><br>

          Kategorie: {{ beautify(expense.verwendungszweck) }}<br>
          Zahlungsart: {{ beautify(expense.zahlungsart) }}<br>
          Datum: {{ expense.datum }}<br>

          <span v-if="expense.notiz">
            Notiz: {{ expense.notiz }}
          </span>
        </div>

        <button
            class="delete-btn"
            @click="deleteTransaction(expense.id)"
        >
          Löschen
        </button>
      </li>
    </ul>

    <p v-else>Keine Ausgaben vorhanden.</p>
  </div>
</template>
