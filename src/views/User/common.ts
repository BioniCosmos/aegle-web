import type { ConfigItem } from '@/components/ui/auto-form'
import { z } from 'zod'

export const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  level: z.number(),
  uuid: z.string().uuid(),
  flow: z.string().min(1),
  security: z.string().min(1),
  date: z.coerce.date(),
})

export type Key = keyof z.infer<typeof schema>

export function customizeLabel(key: Key): [Key, ConfigItem] {
  const labelMap = {
    [key]: undefined,
    uuid: 'UUID',
    date: 'Next Billing Date',
  }
  return [key, { label: labelMap[key] }]
}
