import ky from '@/ky'
import { ref } from 'vue'

export interface Account {
  email: string
  name: string
  role: 'member' | 'admin'
  status: 'signedIn' | 'unverified' | 'needMFA'
}

export const account = ref<Account | null>(null)

export async function refreshAccount() {
  account.value = await ky('api/account').json<Account | null>()
}

export interface TOTP {
  secret: string
  image: string
}

export interface MFA {
  totp: boolean
}

export interface RecoveryCode {
  code: string
  used: boolean
}
