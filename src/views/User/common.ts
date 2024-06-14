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
export type FieldConfig = [Key, ConfigItem]

export const init = (key: Key): [Key, ConfigItem] => [key, {}]

export function customizeLabel([key, value]: FieldConfig): FieldConfig {
  const labelMap = {
    [key]: undefined,
    uuid: 'UUID',
    date: 'Next Billing Date',
  }
  return [key, { ...value, label: labelMap[key] }]
}

export const disableAutoComplete = ([key, value]: FieldConfig): FieldConfig =>
  key === 'name' || key === 'email'
    ? [
        key,
        {
          ...value,
          inputProps: { ...value.inputProps, autocomplete: 'off' },
        },
      ]
    : [key, value]
