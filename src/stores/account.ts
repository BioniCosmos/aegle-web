import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'

class Account {
  username = ''
  password = ''
}

export const useAccountStore = defineStore('account', () => {
  const account = ref(new Account())
  const isAuthorized = ref(false)

  async function authorize() {
    const res = await transfer('/api/account/sign-in', 'POST')
    isAuthorized.value = res !== null && typeof res !== 'string'
  }

  async function signIn() {
    await transfer('/api/account/sign-in', 'POST', account.value)
  }

  async function signOut() {
    await transfer('/api/account/sign-out', 'POST')
  }

  return { account, isAuthorized, authorize, signIn, signOut }
})
