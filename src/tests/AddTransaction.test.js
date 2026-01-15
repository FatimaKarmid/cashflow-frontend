import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddTransaction from '../components/AddTransaction.vue'

global.fetch = vi.fn()
vi.stubGlobal('alert', vi.fn())

describe('AddTransaction.vue', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 7️⃣ rendert Formular
    it('renders form', () => {
        const wrapper = mount(AddTransaction)

        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.text()).toContain('Neue Ausgabe hinzufügen')
    })

    // 8️⃣ sendet POST bei Submit
    it('submits transaction', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({})
        })

        const wrapper = mount(AddTransaction)

        await wrapper.find('#name').setValue('Edeka')
        await wrapper.find('#betrag').setValue(20)
        await wrapper.find('#datum').setValue('2024-01-01')

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auszahlungen'),
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
        )
    })

    // 9️⃣ zeigt Fehlermeldung bei Fehler
    it('shows error on failed submit', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            text: () => Promise.resolve('Fehler beim Speichern')
        })

        const wrapper = mount(AddTransaction)

        await wrapper.find('#name').setValue('Edeka')
        await wrapper.find('#betrag').setValue(20)
        await wrapper.find('#datum').setValue('2024-01-01')

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('Fehler beim Speichern')
    })
})
