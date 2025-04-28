'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import useColorStore from '@/hooks/use-color-store'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ColorUpdater />
      {children}
    </NextThemesProvider>
  )
}

function ColorUpdater() {
  const { theme } = useTheme()
  const { updateCssVariables } = useColorStore(theme)

  React.useEffect(() => {
    updateCssVariables()
  }, [theme, updateCssVariables])

  return null
}
