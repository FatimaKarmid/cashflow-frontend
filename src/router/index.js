import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../components/Dashboard.vue'
import AusgabenListe from '../components/ExpenseList.vue'
import AusgabeHinzufuegen from '../components/AddTransaction.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/ausgaben', component: AusgabenListe },
    { path: '/hinzufuegen', component: AusgabeHinzufuegen }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
