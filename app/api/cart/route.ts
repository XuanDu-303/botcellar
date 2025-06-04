/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCart, setCart } from '@/lib/actions/cart.actions'

export async function GET(req: NextRequest) {
  try {
    const cart = await getCart()
    return NextResponse.json(cart)
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized or failed to fetch cart' },
      { status: 401 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await setCart(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 400 }
    )
  }
}
