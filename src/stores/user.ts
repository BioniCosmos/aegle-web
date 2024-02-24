import { getDateString, transfer, UTCTimeOffsets } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from './common'
import type { Profile } from './profile'

export interface User {
  id: string
  name: string
  email: string
  level: number
  billingDate: string
  account: Account
  profiles: Map<string, string>
}

interface Account {
  vless: VLESSAccount
  vmess: VMessAccount
  trojan: TrojanAccount
}

interface VLESSAccount {
  id: string
  flow: string
  encryption: string
}

interface VMessAccount {
  id: string
  security: string
}

interface TrojanAccount {
  password: string
}

export enum Operation {
  Add,
  Remove,
}

export interface UserResponse {
  user: User
  profiles: Profile[]
}

const newUser = (): User => {
  const user = JSON.parse(
    JSON.stringify({
      id: '',
      name: '',
      email: '',
      level: 0,
      billingDate: '',
      account: {
        vless: { id: '', flow: '', encryption: '' },
        vmess: { id: '', security: '' },
        trojan: { password: '' },
      },
    })
  )
  user.profiles = new Map()
  return user
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>(newUser())
  const isToInsertUser = ref(true)

  const billingDate = computed({
    get: () => getDateString(user.value.billingDate),
    set: (newDate) => {
      user.value.billingDate =
        newDate !== ''
          ? new Date(
              `${newDate}T00:00${UTCTimeOffsets(new Date())}`
            ).toISOString()
          : ''
    },
  })

  const router = useRouter()

  async function toInsertUser() {
    user.value = newUser()
    isToInsertUser.value = true
    await router.push('/user')
  }

  async function toUpdateUser(updatedUser: User) {
    user.value = {
      ...updatedUser,
      profiles: new Map(Object.entries(updatedUser.profiles)),
    }
    isToInsertUser.value = false
    await router.push('/user')
  }

  async function insertUser() {
    await transfer('/api/user', 'POST', {
      ...user.value,
      profiles: Object.fromEntries(user.value.profiles.entries()),
    })
    await router.push('/users')
  }

  async function deleteUser() {
    await transfer(`/api/user/${user.value.id}`, 'DELETE')
    await router.push('/users')
  }

  async function updateUserProfile(operation: Operation, id: string) {
    const currentMsg = message.loading('Working…', { duration: 0 })
    const res = await transfer(`/api/user/${user.value.id}`, 'PATCH', {
      operation,
      id,
    })
    setTimeout(currentMsg.destroy, 3000)

    if (res === null || typeof res === 'string') {
      currentMsg.type = 'error'
      currentMsg.content = res ?? 'Failed'
      return
    }

    currentMsg.type = 'success'
    currentMsg.content = res.message
  }

  return {
    user,
    isToInsertUser,
    billingDate,
    toInsertUser,
    toUpdateUser,
    insertUser,
    deleteUser,
    updateUserProfile,
  }
})
