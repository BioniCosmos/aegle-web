import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Invoice {
  id: string
  name: string
  nextBillingDate: string
  isPaid: boolean
}

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<Invoice[]>([])

  async function extendBillingDate(invoiceId: string) {
    const res = await transfer<Invoice>(`/api/invoice/${invoiceId}`, 'PATCH', {
      billingDate: invoices.value.find(({ id }) => id === invoiceId)
        ?.nextBillingDate,
    })
    if (res === null || typeof res === 'string') {
      return
    }

    invoices.value = invoices.value.map((invoice) =>
      invoice.id === invoiceId ? res : invoice
    )
  }

  return { invoices, extendBillingDate }
})
