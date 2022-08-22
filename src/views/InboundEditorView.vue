<script setup lang="ts">
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import { useInboundStore } from '@/stores/inbound'
import { transfer } from '@/utils'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { Inbound } from './NodeView.vue'

defineEmits<{
  (event: 'delete'): void
}>()

const router = useRouter()
const props = reactive({
  title: '',
  isInsertInbound: false,
})
let data: Inbound = reactive({
  name: '',
  data: '',
  nodeId: '',
})

async function submit() {
  try {
    await transfer('/api/inbound', 'POST', data)
    await router.push('/nodes')
  } catch (err) {
    console.error(err)
  }
}

async function deleteInbound() {
  try {
    await transfer(`/api/inbound/${data.id}`, 'DELETE')
    await router.push('/nodes')
  } catch (err) {
    console.error(err)
  }
}

const { inbound, isToInsertInbound } = storeToRefs(useInboundStore())
if (inbound.value.nodeId === '') {
  router.replace('/nodes')
}
if (isToInsertInbound.value) {
  props.title = 'Adding an inbound'
  props.isInsertInbound = true
  data.nodeId = inbound.value.nodeId
} else {
  props.title = 'Inbound'
  props.isInsertInbound = false
  data = inbound.value
}
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ props.title }}</h1>
    <div class="btn-toolbar mb-2 mb-md-0" v-if="!props.isInsertInbound">
      <div class="btn-group me-2">
        <button class="btn btn-outline-danger btn-sm" type="button" data-bs-toggle="modal"
          data-bs-target="#warning-dialog-box">Remove the inbound</button>
      </div>
    </div>
  </div>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" required v-model="data.name">
    </div>
    <div class="mb-3">
      <label for="data" class="form-label">Inbound configuration</label>
      <textarea class="form-control" id="data" rows="10" required v-model="data.data"></textarea>
    </div>
    <button class="btn btn-primary">Submit</button>
  </form>
  <WarningDialogBox :name="data.name" @delete="deleteInbound" />
</template>
