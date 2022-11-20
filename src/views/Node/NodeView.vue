<script setup lang="ts">
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
  try {
    nodes.value = await transfer(`/api/nodes?limit=10&skip=${(page.value - 1) * 10}`) as Node[] ?? []
    for (const node of nodes.value) {
      profiles.value.set(node.id, await transfer(`/api/profiles?nodeId=${node.id}`) as Profile[])
    }
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Nodes</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button class="btn btn-outline-primary btn-sm" type="button" @click="toInsertNode">Add</button>
      </div>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-sm table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">API address</th>
          <th scope="col">Profiles</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="node in nodes" @click="toUpdateNode(node)">
          <td>{{ node.name }}</td>
          <td>{{ node.apiAddress }}</td>
          <td>
            <button class="btn btn-secondary btn-sm me-1" type="button" v-for="profile in profiles.get(node.id)"
              @click.stop="toUpdateProfile(profile)">{{ profile.name }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <nav>
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="page <= 1 ? 'disabled' : ''">
        <a class="page-link" @click="page--">Previous</a>
      </li>
      <li class="page-item">
        <a class="page-link" @click="page++">Next</a>
      </li>
    </ul>
  </nav>
</template>
