import type { Inbound } from '@/views/NodeView.vue'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useInboundStore = defineStore('inbound', () => {
    const inbound: Inbound = reactive({
        name: '',
        data: '',
        nodeId: '',
    })
    const isToInsertInbound = ref(true)
    return { inbound, isToInsertInbound }
})
