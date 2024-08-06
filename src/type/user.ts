export interface User {
  id: string
  name: string
  email: string
  level: number
  startDate: Temporal.ZonedDateTime
  cycles: number
  uuid: string
  flow: string
  security: string
  profiles: { name: string }[]
}
