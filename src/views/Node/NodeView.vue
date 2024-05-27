<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import WarningDialog from '@/components/WarningDialog.vue'
import { useNodeStore, type Node } from '@/stores/node'
import type { Pagination } from '@/type/pagination'
import ky from 'ky'
import useSWRV from 'swrv'
import { ref } from 'vue'

const page = ref(1)
const { data: pagination, mutate } = useSWRV<Pagination<Node>>(
  () => `/api/nodes?page=${page.value}`
)
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
    <table v-if="pagination?.items.length !== 0">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">API address</th>
          <th scope="col">Profiles</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="node in pagination?.items"
          :key="node.id"
          @click="toUpdateNode(node)"
        >
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
  <PaginationBar
    :page="page"
    @toPrevious="page = pagination?.previousPage!"
    @toNext="page = pagination?.nextPage!"
  />
  <WarningDialog
    :name="profileName"
    :open="open"
    @delete="deleteProfile"
    @close="closeDialog"
  />
</template>
