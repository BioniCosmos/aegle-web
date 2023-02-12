import { transfer } from '@/utils'
import { ref, type Ref } from 'vue'

export interface Invoice {
  id: string
  name: string
  nextBillingDate: string
  isPaid: boolean
}

export async function fetchInvoices() {
  return ((await transfer('/api/invoices') ?? new Array()) as Array<Invoice>).map(value => ref(value))
}

export async function extendBillingDate(invoice: Ref<Invoice>) {
  await transfer(`/api/invoice/${invoice.value.id}`, 'PATCH', {
    billingDate: invoice.value.nextBillingDate
  })
  return fetchInvoices()
}
