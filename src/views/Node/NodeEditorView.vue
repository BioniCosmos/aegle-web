<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import { useNodeStore } from '@/stores/node'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

defineEmits<{
  (event: 'delete'): void
  (event: 'close'): void
}>()

const nodeStore = useNodeStore()
const { node, isToInsertNode } = storeToRefs(nodeStore)
const { insertNode, updateNode, deleteNode } = nodeStore
const { toInsertProfile } = useProfileStore()
const submit = computed(() => isToInsertNode.value ? insertNode : updateNode)
const title = computed(() => isToInsertNode.value ? 'Adding a node' : 'Editing a node')
const isOpen = ref(false)
</script>

<template>
  <BaseLayout>
    <template #title>
      <h3 class="mb-0">{{ title }}</h3>
    </template>
    <template #operations v-if="!isToInsertNode">
      <li>
        <a href="#" role="button" @click="toInsertProfile(node.id)">Add a profile</a>
      </li>
      <li>
        <a href="#" role="button" @click="isOpen = true">Remove the node</a>
      </li>
    </template>
    <form @submit.prevent="submit">
      <label for="name">
        Name
        <input type="text" id="name" required v-model="node.name">
      </label>
      <label for="api-address">
        API address
        <input type="text" id="api-address" required v-model="node.apiAddress">
      </label>
      <button>Submit</button>
    </form>
  </BaseLayout>
  <WarningDialogBox :name="node.name" :is-open="isOpen" @delete="deleteNode" @close="isOpen = false" />
</template>
