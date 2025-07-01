import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { SERVER_URL } from '@/lib/constants'
import Loading from '@/components/shared/loading'

export default function StripeForm({
  priceInCents,
  orderId,
}: {
  priceInCents: number
  orderId: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (stripe == null || elements == null || email == null) return

    setIsLoading(true)
    setErrorMessage('')
    await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/checkout/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('An unknown error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='text-xl font-semibold'>Stripe Checkout</div>
      {errorMessage && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
          {errorMessage}
        </div>
      )}
      <PaymentElement />
      <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      <Button
        type="submit"
        className="w-full cursor-pointer"
        size="lg"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loading /> Processing...
          </div>
        ) : (
          <>
            Pay <ProductPrice price={priceInCents / 100} plain />
          </>
        )}
      </Button>
    </form>
  )
}