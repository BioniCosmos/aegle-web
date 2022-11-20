<script setup lang="ts">
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import { useNodeStore } from '@/stores/node'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

defineEmits<{
  (event: 'delete'): void
}>()

const nodeStore = useNodeStore()
const { node, isToInsertNode } = storeToRefs(nodeStore)
const { insertNode, updateNode, deleteNode } = nodeStore
const { toInsertProfile } = useProfileStore()
const submit = computed(() => isToInsertNode.value ? insertNode : updateNode)
const title = computed(() => isToInsertNode.value ? 'Adding a node' : 'Editing a node')
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ title }}</h1>
    <div class="btn-toolbar mb-2 mb-md-0" v-if="!isToInsertNode">
      <div class="btn-group me-2">
        <button class="btn btn-outline-primary btn-sm" type="button" @click="toInsertProfile(node.id)">Add a
          profile</button>
        <button class="btn btn-outline-danger btn-sm" type="button" data-bs-toggle="modal"
          data-bs-target="#warning-dialog-box">Remove the node</button>
      </div>
    </div>
  </div>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" required v-model="node.name">
    </div>
    <div class="mb-3">
      <label for="api-address" class="form-label">API address</label>
      <input type="text" class="form-control" id="api-address" required v-model="node.apiAddress">
    </div>
    <button class="btn btn-primary">Submit</button>
  </form>
  <WarningDialogBox :name="node.name" @delete="deleteNode" />
</template>
