export interface User {
  id: string
  name: string
  email: string
  level: number
  startDate: Temporal.ZonedDateTime
  cycles: number
  nextDate: Temporal.ZonedDateTime
  uuid: string
  flow: string
  security: string
  profiles: { name: string }[]
}
