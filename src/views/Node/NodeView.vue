<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import WarningDialog from '@/components/WarningDialog.vue'
import { useNodeStore, type Node } from '@/stores/node'
import ky from 'ky'
import useSWRV from 'swrv'
import { ref } from 'vue'

const { data: nodes, mutate } = useSWRV<Node[]>('/api/nodes')
const open = ref(false)
const profileName = ref('')
const { toInsertNode, toUpdateNode } = useNodeStore()

function openDialog(name: string) {
  profileName.value = name
  open.value = true
}

function closeDialog() {
  open.value = false
}

function deleteProfile() {
  ky.delete(`/api/profile/${profileName.value}`)
    .then(() => mutate())
    .then(closeDialog)
}
</script>

<template>
  <BaseLayout>
    <template #title>
      <h2 class="mb-0">Nodes</h2>
    </template>
    <template #operations>
      <li>
        <a href="#" role="button" @click="toInsertNode">Add</a>
      </li>
    </template>
    <table v-if="nodes?.length !== 0">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">API address</th>
          <th scope="col">Profiles</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="node in nodes" :key="node.id" @click="toUpdateNode(node)">
          <td>{{ node.name }}</td>
          <td>{{ node.apiAddress }}</td>
          <td>
            <button
              type="button"
              v-for="profileName in node.profileNames"
              :key="profileName"
              @click.stop="openDialog(profileName)"
            >
              {{ profileName }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center">Nothing here</div>
  </BaseLayout>
  <!-- <nav>
    <ul>
      <li :class="page <= 1 ? 'disabled' : ''">
        <a @click="page--">Previous</a>
      </li>
      <li>
        <a @click="page++">Next</a>
      </li>
    </ul>
  </nav> -->
  <WarningDialog
    :name="profileName"
    :open="open"
    @delete="deleteProfile"
    @close="closeDialog"
  />
</template>
