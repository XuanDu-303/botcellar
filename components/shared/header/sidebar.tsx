"use client";
import * as React from "react";
import Link from "next/link";
import { X, ChevronRight, UserCircle, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/lib/actions/user.actions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Session } from "next-auth";
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'

export default function Sidebar({
  categories,
  session,
}: {
  categories: string[];
  session: Session | null;
}) {
  const locale = useLocale()
  const t = useTranslations("Header")
  const [open, setOpen] = useState(false);
  return (
    <Drawer direction={getDirection(locale) === 'rtl' ? 'right' : 'left'} open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="header-button flex items-center !p-2">
        <MenuIcon className="h-5 w-5 mr-1" />
        {t('All')}
      </DrawerTrigger>
      <DrawerContent className="!max-w-[364px] mt-0 top-0">
        <div className="flex flex-col h-full">
          {/* User Sign In Section */}
          <div className="dark bg-gray-800 text-foreground flex items-center justify-between">
            <Link
              href={session ? "/account" : "/sign-in"}
              className="flex-1 border pt-2 px-5 border-transparent hover:border-white"
            >
              <DrawerHeader className="p-1">
                <DrawerTitle className="flex items-center w-full">
                  <UserCircle className="size-8 mr-2" />
                  <DrawerClose asChild className="w-full">
                    <span className="text-lg font-semibold cursor-pointer">
                      {session
                        ? `${t('Hello')}, ${session.user.name}`
                        : `${t("Hello")}, ${t("sign in")}`}
                    </span>
                  </DrawerClose>
                </DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>
            </Link>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-3 -right-12 bg-transparent rounded-xl shadow-md border-2 transition-all hover:border-2 hover:border-white duration-300 ease-in-out cursor-pointer
                  ${open ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
              >
                <X className="size-6" />
              </Button>
            </DrawerClose>
          </div>

          {/* Shop By Category */}
          <div className="flex-1 overflow-y-auto">
            <div className="py-4 px-6 border-b">
              <h2 className="text-lg font-semibold">{t('Shop By Department')}</h2>
            </div>
            <nav className="flex flex-col">
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className={`group !px-6 flex items-center justify-between item-button`}
                  >
                    <span>{category}</span>
                    <ChevronRight className="stroke-2 size-[22px] text-gray-400 group-hover:text-gray-700 transition-colors duration-200" />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* Setting and Help */}
          <div className="border-t flex flex-col ">
            <div className="py-4 px-6">
              <h2 className="text-lg font-semibold">{t('Help & Settings')}</h2>
            </div>
            <DrawerClose asChild>
              <Link href="/account" className="item-button !px-6">
                 {t('Your account')}
              </Link>
            </DrawerClose>{" "}
            <DrawerClose asChild>
              <Link href="/page/customer-service" className="item-button !px-6">
                {t('Customer Service')}
              </Link>
            </DrawerClose>
            {session ? (
              <form action={SignOut} className="w-full">
                <Button
                  className="w-full justify-start item-button text-base !py-6 !px-6"
                  variant="ghost"
                >
                  {t('Sign out')}
                </Button>
              </form>
            ) : (
              <Link href="/sign-in" className="item-button !py-4 !px-6">
                {t('Sign in')}
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
