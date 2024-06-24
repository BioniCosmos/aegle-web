import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseJson = (text: string) =>
  JSON.parse(text, (key, value) => {
    if (key.endsWith('Date')) {
      return Temporal.ZonedDateTime.from(value)
    }
    if (key === 'expire') {
      return Temporal.Instant.from(value)
    }
    return value
  })
