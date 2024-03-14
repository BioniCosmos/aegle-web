import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from './common'
import type { Profile } from './profile'

export class User {
  id = ''
  name = ''
  email = ''
  level = 0
  account: Account = {
    vless: { id: '', flow: '', encryption: '' },
    vmess: { id: '', security: '' },
    trojan: { password: '' },
  }
  profiles: Record<string, string> = {}
  startDate = Temporal.Now.zonedDateTimeISO()
  cycles = 1

  get nextDate() {
    return this.startDate.add({ months: this.cycles })
  }

  set nextDate(date) {
    this.startDate = date.subtract({ months: 1 })
    this.cycles = 1
  }

  static fromUserData(userData: User) {
    delete (userData as any).nextDate
    const user = new User()
    return Object.assign(user, userData)
  }

  toJSON(): User {
    return { ...this, nextDate: this.nextDate } satisfies User
  }
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

export const useUserStore = defineStore('user', () => {
  const user = ref(new User())
  const isToInsertUser = ref(true)

  const router = useRouter()

  async function toInsertUser() {
    user.value = new User()
    isToInsertUser.value = true
    await router.push('/user')
  }

  async function toUpdateUser(userData: User) {
    user.value = User.fromUserData(userData)
    isToInsertUser.value = false
    await router.push('/user')
  }

  async function insertUser() {
    await transfer('/api/user', 'POST', user.value)
    await router.push('/users')
  }

  async function deleteUser() {
    await transfer(`/api/user/${user.value.id}`, 'DELETE')
    await router.push('/users')
  }

  async function updateUserProfile(operation: Operation, id: string) {
    await useMessage(`/api/user/${user.value.id}`, 'PATCH', {
      operation,
      id,
    })
  }

  function generate() {
    const uuid = crypto.randomUUID()
    Object.assign(user.value, {
      account: {
        vless: { id: uuid, flow: 'xtls-rprx-vision', encryption: 'none' },
        vmess: { id: uuid, security: 'auto' },
        trojan: { password: uuid },
      },
    })
  }

  async function extend() {
    user.value.cycles++
    await useMessage('/api/user', 'PUT', user.value)
  }

  return {
    user,
    isToInsertUser,
    toInsertUser,
    toUpdateUser,
    insertUser,
    deleteUser,
    updateUserProfile,
    generate,
    extend,
  }
})
