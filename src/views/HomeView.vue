<script setup lang="ts">
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
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Dashboard</h1>
  </div>
  <h2>Invoices</h2>
  <div class="table-responsive">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Next Billing Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invoice in invoices" :key="invoice.value.id"
          :style="{ backgroundColor: invoice.value.isPaid ? 'unset' : 'red' }">
          <td>{{ invoice.value.name }}</td>
          <td>{{ getDateString(new Date(invoice.value.nextBillingDate)) }}</td>
          <td><button type="button" class="btn btn-secondary btn-sm" @click="submit(invoice)">Extend</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
