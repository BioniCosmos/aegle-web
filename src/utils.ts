export async function transfer(
  input: RequestInfo | URL,
  method: string = 'GET',
  data?: unknown
): Promise<unknown> {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  try {
    const resp = await fetch(input, init)
    if (resp.ok) {
      return resp.json()
    }
  } catch (err) {
    console.error(err)
  }
  return null
}

export function getDateString(date: Date | string) {
  if (typeof date === 'string') {
    if (date === '') {
      return ''
    }
    date = new Date(date)
  }
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export function UTCTimeOffsets(date: Date) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const timeZone = -date.getTimezoneOffset() / 60
  return `${timeZone > 0 ? '+' : ''}${timeZone.toString().padStart(2, '0')}:00`
}
