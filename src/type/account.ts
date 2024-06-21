import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface Account {
  email: string
  name: string
  role: 'member' | 'admin'
  status: 'normal' | 'unverified'
}

export function useAccount(): [Account | null, (value: Account) => void] {
  const store = useStorage('account', '')
  const get = computed(() =>
    store.value !== '' ? JSON.parse(store.value) : null,
  )
  const set = (value: Account) => (store.value = JSON.stringify(value))
  return [get.value, set]
}
