import { transfer } from '@/utils'

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
