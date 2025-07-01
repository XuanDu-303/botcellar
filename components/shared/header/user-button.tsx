
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { auth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function UserButton() {
  const session = await auth()
  const t = await getTranslations('Header')

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="header-button flex items-center gap-1 cursor-pointer">
            <div className="flex flex-col text-xs text-left">
              <span>
                {t('Hello')}, {session ? session.user.name : t('sign in')}
              </span>
              <span className="font-bold">{t('Account & Orders')}</span>
            </div>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          {session ? (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <Link className="w-full" href="/account">
                  <DropdownMenuItem>{t('Your account')}</DropdownMenuItem>
                </Link>
                <Link className="w-full" href="/account/orders">
                  <DropdownMenuItem>{t('Your orders')}</DropdownMenuItem>
                </Link>
                {session.user.role === 'Admin' && (
                  <Link className="w-full" href="/admin/overview">
                    <DropdownMenuItem>{t('Admin')}</DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuGroup>
              <DropdownMenuItem className="p-0 mb-1">
                <form action={SignOut} className="w-full">
                  <Button
                    className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                    variant="ghost"
                  >
                    {t('Sign out')}
                  </Button>
                </form>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link
                    className={cn(buttonVariants(), 'w-full cursor-pointer')}
                    href="/sign-in"
                  >
                    {t('Sign in')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                {t('New Customer')}?{' '}
                <Link href="/sign-up" className="cursor-pointer underline">
                  {t('Sign up')}
                </Link>
              </DropdownMenuLabel>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
