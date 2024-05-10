import type { Profile } from './profile'

export class User {
  id = ''
  name = ''
  email = ''
  level = 0
  account = {
    vless: { id: '', flow: '', encryption: '' },
    vmess: { id: '', security: '' },
    trojan: { password: '' },
  }
  profileIds = Array.of<string>()
  startDate = Temporal.Now.zonedDateTimeISO()
  cycles = 1
}

export const getNextDate = (user: User) =>
  user.startDate.add({ months: user.cycles })

export const parseUser = (text: string) =>
  JSON.parse(text, (key, value) =>
    key.endsWith('Date') ? Temporal.ZonedDateTime.from(value) : value
  )

export enum Operation {
  Add,
  Remove,
}

export interface UserResponse {
  user: User
  profiles: Profile[]
}
