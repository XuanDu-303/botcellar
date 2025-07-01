'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IForgotPassword } from '@/types'
import { ForgotPasswordSchema } from '@/lib/validator'
import { requestPasswordReset } from '@/lib/actions/user.actions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Loading from '@/components/shared/loading'

export default function ForgotPasswordForm() {
  const form = useForm<IForgotPassword>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: IForgotPassword) => {
    const res = await requestPasswordReset(data)

    if (res.success) {
      toast.success('Email sent', {
        description: 'Check your inbox for a reset link',
      })
    } else {
      toast.error('Error', {
        description: res.message ?? 'Something went wrong',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer">
          {form.formState.isSubmitting ? <div className="flex gap-2 items-center">{<Loading className="fill-foreground" />}</div> : `Send Reset Link`}
        </Button>
      </form>
    </Form>
  )
}