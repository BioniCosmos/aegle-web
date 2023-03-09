<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import { extendBillingDate, fetchInvoices, type Invoice } from '@/stores/invoice'
import { getDateString } from '@/utils'
import { onMounted, ref, type Ref } from 'vue'

const invoices = ref(new Array<Ref<Invoice>>())

async function submit(invoice: Ref<Invoice>) {
  const tmp = await extendBillingDate(invoice)
  if (tmp != null) {
    invoices.value = tmp
  }
}

onMounted(async () => {
  const tmp = await fetchInvoices()
  if (tmp != null) {
    invoices.value = tmp
  }
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
        <tr v-for="invoice in invoices" :key="invoice.value.id"
          :style="{ backgroundColor: invoice.value.isPaid ? 'unset' : 'red' }">
          <td>{{ invoice.value.name }}</td>
          <td>{{ getDateString(new Date(invoice.value.nextBillingDate)) }}</td>
          <td>
            <button type="button" @click="submit(invoice)">Extend</button>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseLayout>
</template>
