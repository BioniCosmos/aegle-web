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
