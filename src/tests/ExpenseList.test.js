import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ExpenseList from '../components/ExpenseList.vue'

global.fetch = vi.fn()
vi.stubGlobal('alert', vi.fn())

const mockExpenses = [
    {
        id: '1',
        name: 'Netflix',
        betrag: 15,
        datum: '2024-01-01',
        verwendungszweck: 'FREIZEIT',
        zahlungsart: 'KARTE'
    }
]

describe('ExpenseList.vue', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        fetch.mockResolvedValue({
            json: () => Promise.resolve(mockExpenses)
        })
    })

    // 1️⃣ rendert Überschrift
    it('renders title', async () => {
        const wrapper = mount(ExpenseList)
        await flushPromises()

        expect(wrapper.text()).toContain('Ausgabenübersicht')
    })

    // 2️⃣ lädt Ausgaben beim Mount
    it('fetches expenses on mount', async () => {
        const wrapper = mount(ExpenseList)
        await flushPromises()

        expect(fetch).toHaveBeenCalled()
        expect(wrapper.text()).toContain('Netflix')
    })

    // 3️⃣ zeigt leere Meldung
    it('shows empty message when no expenses', async () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve([])
        })

        const wrapper = mount(ExpenseList)
        await flushPromises()

        expect(wrapper.text()).toContain('Keine Ausgaben vorhanden')
    })

    // 4️⃣ Filter nach Name
    it('applies name filter', async () => {
        const wrapper = mount(ExpenseList)
        await flushPromises()

        const input = wrapper.find('input[type="text"]')
        await input.setValue('Net')

        expect(fetch).toHaveBeenLastCalledWith(
            expect.stringContaining('name=Net')
        )
    })



    // 6️⃣ Löschen triggert DELETE
    it('deletes transaction', async () => {
        fetch
            .mockResolvedValueOnce({ json: () => Promise.resolve(mockExpenses) }) // initial load
            .mockResolvedValueOnce({}) // delete

        const wrapper = mount(ExpenseList)
        await flushPromises()

        const deleteBtn = wrapper.find('.delete-btn')
        await deleteBtn.trigger('click')

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auszahlungen/1'),
            expect.objectContaining({ method: 'DELETE' })
        )
    })
})
