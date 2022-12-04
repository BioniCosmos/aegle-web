export async function transfer(input: RequestInfo | URL, method: string = 'GET', data?: unknown): Promise<unknown> {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  const resp = await fetch(input, init)
  if (resp.ok || resp.status === 404) {
    if (resp.status === 200) {
      return resp.json()
    } else {
      return null
    }
  } else {
    throw new Error(`${resp.status} ${resp.statusText}: ${await resp.text()}`)
  }
}

export function getDateString(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export function UTCTimeOffsets(date: Date) {
  const timeZone = (-new Date().getTimezoneOffset() / 60)
  return `${timeZone > 0 ? '+' : ''}${timeZone.toString().padStart(2, '0')}:00`
}
