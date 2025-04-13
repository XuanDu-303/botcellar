import { ShoppingCartIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <Link href='/signin' className='header-button flex flex-col items-center'>
          <UserIcon className='h-5 w-5' />
          <span className=''>Sign in</span>
        </Link>

        <Link href='/cart' className='header-button flex flex-col items-center'>
          <ShoppingCartIcon className='h-5 w-5' />
          <span className=''>Cart</span>
        </Link>
      </nav>
    </div>
  )
}