<template>
  <div id="app">
    <!-- Navigation -->
    <header class="navbar">
      <h1>💸 CashFlow</h1>
      <nav>
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/ausgaben" class="nav-link">Ausgaben</router-link>
        <router-link to="/hinzufuegen" class="nav-link">Hinzufügen</router-link>
      </nav>
    </header>

    <!-- Seiteninhalt -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style scoped>
/* Grundlayout */
#app {
  font-family: system-ui, Arial, sans-serif;
  background-color: #f7f9fc;
  min-height: 100vh;
}

/* Navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  padding: 16px 32px;
  color: white;
}

.navbar h1 {
  margin: 0;
  font-size: 22px;
}

/* Navigation Links */
nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #cbd5f5;
  text-decoration: none;
  font-weight: 500;
}

.nav-link.router-link-active {
  color: #ffffff;
  border-bottom: 2px solid #42b983;
}

/* Seiteninhalt */
.content {
  padding: 30px;
}
</style>
