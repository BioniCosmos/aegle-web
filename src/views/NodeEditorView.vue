<script setup lang="ts">
import { useNodeStore } from '@/stores/node'
import { transfer } from '@/utils'
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { Node } from './NodeView.vue'

const router = useRouter()
const props = reactive({
  title: '',
  method: '',
  isUpdateNode: false,
})
let data: Node = reactive({
  name: '',
  apiAddress: '',
})

async function submit() {
  try {
    await transfer(`/api/node/${props.isUpdateNode ? data.id : ''}`, props.method, data)
    await router.push('/nodes')
  } catch (err) {
    console.error(err)
  }
}

async function deleteNode() {
  try {
    await transfer(`/api/node/${data.id}`, 'DELETE')
    await router.push('/nodes')
  } catch (err) {
    console.error(err)
  }
}

const { node, isToInsertNode } = storeToRefs(useNodeStore())
if (isToInsertNode.value) {
  props.title = 'Adding a node'
  props.method = 'POST'
  props.isUpdateNode = false
} else {
  props.title = 'Editing a node'
  props.method = 'PATCH'
  props.isUpdateNode = true
  data = node.value
}
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ props.title }}</h1>
    <div class="btn-toolbar mb-2 mb-md-0" v-if="props.isUpdateNode">
      <div class="btn-group me-2">
        <button class="btn btn-outline-danger btn-sm" type="button" @click="deleteNode">Remove</button>
      </div>
    </div>
  </div>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" required v-model="data.name">
    </div>
    <div class="mb-3">
      <label for="api-address" class="form-label">API address</label>
      <input type="text" class="form-control" id="api-address" required v-model="data.apiAddress">
    </div>
    <button class="btn btn-primary">Submit</button>
  </form>
</template>
