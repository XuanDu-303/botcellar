"use client";
import React from "react";
import useCartSidebar from "@/hooks/use-cart-sidebar";
import AppInitializer from "../app-initializer";
import { ClientSetting } from "@/types";
import CartSidebar from "../cart-sidebar";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import SyncCartWrapper from "./sync-cart-wrapper";

export default function ClientProviders({
  children,
  setting,
}: {
  children: React.ReactNode;
  setting: ClientSetting;
}) {
  const visible = useCartSidebar();

  return (
    <AppInitializer setting={setting}>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme={setting.common.defaultTheme.toLocaleLowerCase()}
        >
          <SyncCartWrapper /> {/* chỉ chạy hook bên trong SessionProvider */}
          {visible ? (
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
    </AppInitializer>
  );
}
