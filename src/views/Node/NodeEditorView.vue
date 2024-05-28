<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import WarningDialog from '@/components/WarningDialog.vue'
import { Node } from '@/type/node'
import ky from 'ky'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const id = useRoute().params.id as string
const isUpdate = computed(() => id !== '')

const node = ref(new Node())
if (isUpdate.value) {
  ky(`/api/node/${id}`)
    .json<Node>()
    .then((value) => (node.value = value))
}

const open = ref(false)

function submit() {
  ky[isUpdate.value ? 'put' : 'post']('/api/node', { json: node.value }).then(
    () => router.push('/nodes')
  )
}

function deleteNode() {
  ky.delete(`/api/node/${id}`).then(() => router.push('/nodes'))
}
</script>

<template>
  <BaseLayout>
    <template #title>
      <h3 class="mb-0">{{ isUpdate ? 'Editing a node' : 'Adding a node' }}</h3>
    </template>
    <template #operations v-if="isUpdate">
      <li>
        <RouterLink :to="`/profile?nodeId=${id}`" role="button">
          Add a profile
        </RouterLink>
      </li>
      <li>
        <a href="#" role="button" @click="open = true">Remove the node</a>
      </li>
    </template>
    <form @submit.prevent="submit">
      <label for="name">
        Name
        <input type="text" id="name" required v-model="node.name" />
      </label>
      <label for="api-address">
        API address
        <input
          type="text"
          id="api-address"
          required
          v-model="node.apiAddress"
        />
      </label>
      <button>Submit</button>
    </form>
  </BaseLayout>
  <WarningDialog
    :name="node.name"
    :open="open"
    @delete="deleteNode"
    @close="open = false"
  />
</template>
