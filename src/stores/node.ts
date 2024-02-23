import { transfer } from '@/utils'
import { createDiscreteApi } from 'naive-ui'
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
    await transfer('/api/node', 'POST', node.value)
    await router.push('/nodes')
  }

  async function updateNode() {
    await transfer(`/api/node`, 'PUT', node.value)
    await router.push('/nodes')
  }

  async function deleteNode() {
    await transfer(`/api/node/${node.value.id}`, 'DELETE')
    await router.push('/nodes')
  }

  async function resetNode() {
    const res = await transfer(`/api/node/${node.value.id}/reset`, 'POST')
    const { message } = createDiscreteApi(['message'])

    if (res === null) {
      return
    }
    if (typeof res === 'string') {
      message.error(res)
      return
    }
    message.success(res.message)
  }

  return {
    node,
    isToInsertNode,
    toInsertNode,
    toUpdateNode,
    insertNode,
    updateNode,
    deleteNode,
    resetNode,
  }
})
