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
    isAuthorized.value = await transfer('/api/account/sign-in', 'POST') !== null
  }

  async function signIn() {
    await transfer('/api/account/sign-in', 'POST', account.value)
  }

  async function signOut() {
    await transfer('/api/account/sign-out', 'POST')
  }

  return { account, isAuthorized, authorize, signIn, signOut }
})
