'use client'
import React from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import CartSidebar from '../cart-sidebar'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './theme-provider'
import SyncCartWrapper from './sync-cart-wrapper'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const isCartSidebarOpen = useCartSidebar()
  
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <SyncCartWrapper /> {/* chỉ chạy hook bên trong SessionProvider */}
        {isCartSidebarOpen ? (
          <div className="flex min-h-screen">
            <div className="flex-1 overflow-hidden">{children}</div>
            <CartSidebar />
          </div>
        ) : (
          <>{children}</>
        )}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}