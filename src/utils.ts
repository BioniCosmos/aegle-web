import { parseUser } from './stores/user'

export interface DefaultResponse {
  code: number
  message: string
}

export async function transfer<T = DefaultResponse>(
  input: RequestInfo | URL,
  method: string = 'GET',
  data?: unknown
) {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  }
  try {
    const resp = await fetch(input, init)
    if (resp.ok) {
      return parseUser(await resp.text()) as Promise<T>
    }
    return resp.text()
  } catch (err) {
    console.error(err)
    return null
  }
}
