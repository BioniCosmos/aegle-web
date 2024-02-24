import { createDiscreteApi, darkTheme, lightTheme, useOsTheme } from 'naive-ui'

export const { message } = createDiscreteApi(['message'], {
  configProviderProps: {
    theme: useOsTheme().value === 'light' ? lightTheme : darkTheme,
  },
})
