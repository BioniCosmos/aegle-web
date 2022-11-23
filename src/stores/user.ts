import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface User {
  id: string
  name: string
  email: string
  level: number
  account: Map<string, Account>
  profiles: Map<string, string>
}

type Account = VLESSAccount & VMessAccount & TrojanAccount

interface VLESSAccount {
  id?: string
  flow?: string
  encryption?: string
}

interface VMessAccount {
  id?: string
  security?: string
}

interface TrojanAccount {
  password?: string
  flow?: string
}

export enum Operation {
  Add,
  Remove,
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    id: '',
    name: '',
    email: '',
    level: 0,
    account: new Map([
      ['vless', {}],
      ['vmess', {}],
      ['trojan', {}],
    ]),
    profiles: new Map(),
  })
  const isToInsertUser = ref(true)

  const router = useRouter()

  async function toInsertUser() {
    user.value.id = ''
    user.value.name = ''
    user.value.email = ''
    user.value.level = 0
    user.value.account = new Map([
      ['vless', {}],
      ['vmess', {}],
      ['trojan', {}],
    ])
    user.value.profiles = new Map()
    isToInsertUser.value = true
    await router.push('/user')
  }

  async function toUpdateUser(newUser: User) {
    user.value.id = newUser.id
    user.value.name = newUser.name
    user.value.email = newUser.email
    user.value.level = newUser.level
    user.value.account = new Map(Object.entries(newUser.account))
    user.value.profiles = new Map(Object.entries(newUser.profiles))
    isToInsertUser.value = false
    await router.push('/user')
  }

  async function insertUser() {
    try {
      await transfer('/api/user', 'POST', {
        id: user.value.id,
        name: user.value.name,
        email: user.value.email,
        level: user.value.level,
        account: Object.fromEntries(user.value.account.entries()),
        profiles: Object.fromEntries(user.value.profiles.entries()),
      })
      await router.push('/users')
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteUser() {
    try {
      await transfer(`/api/user/${user.value.id}`, 'DELETE')
      await router.push('/users')
    } catch (err) {
      console.error(err)
    }
  }

  async function updateUserProfile(operation: Operation, id: string) {
    try {
      await transfer(`/api/user/${user.value.id}`, 'PATCH', {
        operation,
        id,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return { user, isToInsertUser, toInsertUser, toUpdateUser, insertUser, deleteUser, updateUserProfile }
})
