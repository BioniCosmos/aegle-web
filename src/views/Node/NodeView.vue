<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import type { NodeResponse } from '@/stores/node'
import { useNodeStore } from '@/stores/node'
import { useProfileStore } from '@/stores/profile'
import { transfer } from '@/utils'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { toInsertNode, toUpdateNode } = useNodeStore()
const { toUpdateProfile } = useProfileStore()
const nodes = ref<NodeResponse[]>([])
const page = ref(
  ((page) => (Number.isNaN(page) ? 1 : page))(Number(route.query['page']))
)

watchEffect(async () => {
  const res = await transfer<NodeResponse[]>(
    `/api/nodes?limit=10&skip=${(page.value - 1) * 10}`
  )
  nodes.value = Array.isArray(res) ? res : []
})
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
    <table v-if="nodes.length !== 0">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">API address</th>
          <th scope="col">Profiles</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ node, profiles } in nodes"
          :key="node.id"
          @click="toUpdateNode(node)"
        >
          <td>{{ node.name }}</td>
          <td>{{ node.apiAddress }}</td>
          <td>
            <button
              type="button"
              v-for="profile in profiles"
              :key="profile.id"
              @click.stop="toUpdateProfile(profile)"
            >
              {{ profile.name }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center">Nothing here</div>
  </BaseLayout>
  <nav>
    <ul>
      <li :class="page <= 1 ? 'disabled' : ''">
        <a @click="page--">Previous</a>
      </li>
      <li>
        <a @click="page++">Next</a>
      </li>
    </ul>
  </nav>
</template>
