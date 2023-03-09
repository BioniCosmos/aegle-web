<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import type { Node } from '@/stores/node'
import { useNodeStore } from '@/stores/node'
import type { Profile } from '@/stores/profile'
import { useProfileStore } from '@/stores/profile'
import { transfer } from '@/utils'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { toInsertNode, toUpdateNode } = useNodeStore()
const { toUpdateProfile } = useProfileStore()
const nodes = ref<Node[]>([])
const profiles = ref(new Map<string, Profile[]>())
const page = ref(((page) => Number.isNaN(page) ? 1 : page)(Number(route.query['page'])))

watchEffect(async () => {
  nodes.value = await transfer(`/api/nodes?limit=10&skip=${(page.value - 1) * 10}`) as Node[] ?? []
  const requests = nodes.value.map(node => transfer(`/api/profiles?nodeId=${node.id}`) as Promise<Array<Profile>>)
  const responses = await Promise.allSettled(requests)
  for (const [i, node] of nodes.value.entries()) {
    const profile = responses[i]
    if (profile.status === 'fulfilled') {
      profiles.value.set(node.id, profile.value)
    } else {
      console.error(profile.reason)
    }
  }
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
    <table>
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
            <button type="button" v-for="profile in profiles.get(node.id)" :key="profile.id"
              @click.stop="toUpdateProfile(profile)">{{
                profile.name }}</button>
          </td>
        </tr>
      </tbody>
    </table>
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
