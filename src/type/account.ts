import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface Account {
  email: string
  name: string
  role: 'member' | 'admin'
  status: 'normal' | 'unverified'
  expire: Temporal.Instant
}

export function useAccount() {
  const store = useStorage('account', '')
  const account = computed<Account | null>({
    get: () => (store.value !== '' ? JSON.parse(store.value) : null),
    set(value) {
      store.value = value !== null ? JSON.stringify(value) : null
    },
  })
  if (
    account.value !== null &&
    Temporal.Instant.compare(account.value.expire, Temporal.Now.instant()) !== 1
  ) {
    account.value = null
  }
  return account
}

export interface TOTP {
  secret: string
  image: string
}
