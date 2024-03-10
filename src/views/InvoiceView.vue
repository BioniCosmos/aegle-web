<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import { useInvoiceStore, type Invoice } from '@/stores/invoice'
import { getDateString, transfer } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const invoiceStore = useInvoiceStore()
const { invoices } = storeToRefs(invoiceStore)
const { extendBillingDate } = invoiceStore

onMounted(async () => {
  const res = await transfer<Invoice[]>('/api/invoices')
  invoices.value = Array.isArray(res) ? res : []
})
</script>

<template>
  <BaseLayout>
    <template #title>
      <h2 class="mb-0">Invoices</h2>
    </template>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Next Billing Date</th>
          <th scope="col">Extend</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="invoice in invoices"
          :key="invoice.id"
          :style="{ backgroundColor: invoice.isPaid ? 'unset' : 'red' }"
        >
          <td>{{ invoice.name }}</td>
          <td>{{ getDateString(invoice.nextBillingDate) }}</td>
          <td>
            <button @click="extendBillingDate(invoice.id)">Extend</button>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseLayout>
</template>
