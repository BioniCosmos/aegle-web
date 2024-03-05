import { transfer } from '@/utils'
import { createDiscreteApi, darkTheme, lightTheme, useOsTheme } from 'naive-ui'

export const { message } = createDiscreteApi(['message'], {
  configProviderProps: {
    theme: useOsTheme().value === 'light' ? lightTheme : darkTheme,
  },
})

export async function useMessage(
  ...transferOptions: Parameters<typeof transfer>
) {
  const currentMsg = message.loading('Working…', { duration: 0 })
  const res = await transfer(...transferOptions)
  setTimeout(currentMsg.destroy, 3000)

  if (res === null || typeof res === 'string') {
    currentMsg.type = 'error'
    currentMsg.content = res ?? 'Failed'
    return
  }

  currentMsg.type = 'success'
  currentMsg.content = res.message
}
