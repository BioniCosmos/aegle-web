<script setup lang="ts">
import { useNodeStore } from '@/stores/node'
import { transfer } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Node {
  id?: string
  name: string
  apiAddress: string
}

interface Inbound {
  name: string
}

const router = useRouter()
const nodes = ref<Node[]>([])
const inbounds = ref<Map<string, Inbound[]>>(new Map())
const { node: nodeStore, isToInsertNode } = storeToRefs(useNodeStore())

async function toInsertNode() {
  isToInsertNode.value = true
  await router.push('/node')
}

async function toUpdateNode(node: Node) {
  nodeStore.value = node
  isToInsertNode.value = false
  await router.push('/node')
}

onMounted(async () => {
  try {
    nodes.value = await transfer(`/api/nodes?limit=5&skip=${0}`) as Node[]
    for (const node of nodes.value) {
      inbounds.value.set(node.id!, await transfer(`/api/inbounds?nodeId=${node.id}`) as Node[])
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
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">API address</th>
          <th scope="col">Inbounds</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="node in nodes" @click="toUpdateNode(node)">
          <td>{{ node.name }}</td>
          <td>{{ node.apiAddress }}</td>
          <td>
            <a v-for="inbound in inbounds.get(node.id!)">{{ inbound.name }}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
