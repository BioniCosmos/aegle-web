import { transfer } from '@/utils'
import { ref, type Ref } from 'vue'

export interface Invoice {
  id: string
  name: string
  nextBillingDate: string
  isPaid: boolean
}

export async function fetchInvoices() {
  try {
    return (await transfer('/api/invoices') as Array<Invoice>).map(value => ref(value))
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function extendBillingDate(invoice: Ref<Invoice>) {
  try {
    await transfer(`/api/invoice/${invoice.value.id}`, 'PATCH', {
      billingDate: invoice.value.nextBillingDate
    })
  } catch (err) {
    console.error(err)
  }
  return fetchInvoices()
}
