import Link from 'next/link'
import CartButton from './cart-button'

export default function Menu() {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        <Link href='/signin' className='header-button flex items-center'>
          {/* <UserIcon className='h-5 w-5' /> */}
          <span className=''>Sign in</span>
        </Link>

        <CartButton />
      </nav>
    </div>
  )
}