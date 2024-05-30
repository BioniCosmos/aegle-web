export class User {
  id = ''
  name = ''
  email = ''
  level = 0
  startDate = Temporal.Now.zonedDateTimeISO()
  cycles = 1
  uuid = ''
  flow = ''
  security = ''
  profiles: { name: string }[] = []
}

export const getNextDate = (user: User) =>
  user.startDate.add({ months: user.cycles })

export const parseUser = (text: string) =>
  JSON.parse(text, (key, value) =>
    key.endsWith('Date') ? Temporal.ZonedDateTime.from(value) : value,
  )
