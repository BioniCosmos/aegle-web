import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Node {
  id: string
  name: string
  apiAddress: string
}

export const useNodeStore = defineStore('node', () => {
  const node = ref({
    id: '',
    name: '',
    apiAddress: '',
  })
  const isToInsertNode = ref(true)

  const router = useRouter()

  async function toInsertNode() {
    node.value.id = ''
    node.value.name = ''
    node.value.apiAddress = ''
    isToInsertNode.value = true
    await router.push('/node')
  }

  async function toUpdateNode(node: Node) {
    useNodeStore().$patch({ node })
    isToInsertNode.value = false
    await router.push('/node')
  }

  async function insertNode() {
    try {
      await transfer('/api/node', 'POST', node.value)
      await router.push('/nodes')
    } catch (err) {
      console.error(err)
    }
  }

  async function updateNode() {
    try {
      await transfer(`/api/node/${node.value.id}`, 'PATCH', node.value)
      await router.push('/nodes')
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteNode() {
    try {
      await transfer(`/api/node/${node.value.id}`, 'DELETE')
      await router.push('/nodes')
    } catch (err) {
      console.error(err)
    }
  }

  return { node, isToInsertNode, toInsertNode, toUpdateNode, insertNode, updateNode, deleteNode }
})
