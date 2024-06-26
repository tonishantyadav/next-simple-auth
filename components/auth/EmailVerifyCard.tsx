'use client'

import { FormCardError } from '@/components/FormCard'
import InputOTP from '@/components/auth/InputOTP'
import { Button } from '@/components/ui'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import ToastContainer from '@/components/ui/toast'
import { useEmailVerify } from '@/hooks/auth/useEmailVerify'
import { handleError } from '@/lib/error'
import { InputOTPSchema } from '@/schemas/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import BeatLoader from 'react-spinners/BeatLoader'
import { toast } from 'react-toastify'
import { z } from 'zod'

const EmailVerifyCard = () => {
  const form = useForm<z.infer<typeof InputOTPSchema>>({
    resolver: zodResolver(InputOTPSchema),
    defaultValues: {
      code: '',
    },
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const emailVerify = useEmailVerify()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const success = searchParams.get('success')

    if (token) setToken(token)
    if (success) {
      setSuccess(success)
      router.replace(`${pathname}?token=${token}`, { scroll: true })
    }
  }, [token, searchParams, router, pathname])

  useEffect(() => {
    if (success) {
      toast.success(success)
      setSuccess('')
    }
  }, [success])

  const onSubmit = async (formData: z.infer<typeof InputOTPSchema>) => {
    try {
      if (token) {
        await emailVerify.mutateAsync({
          code: formData.code,
          token,
          deleteToken: true,
        })
        router.push('/auth/signin')
      }
    } catch (error) {
      const errorMessage = handleError(error)
      setError(errorMessage)
    }
    form.reset()
  }

  return (
    <>
      <ToastContainer />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="container">
              <Card>
                <CardHeader className="ml-1">
                  <span className="text-4xl font-semibold md:text-4xl lg:text-4xl">
                    Email Verification
                  </span>
                </CardHeader>
                <CardContent className="mx-2 max-w-xl space-y-3">
                  <InputOTP
                    form={form}
                    description={'Enter the verification code.'}
                  />
                  {error && <FormCardError message={error} />}
                </CardContent>
                <CardFooter className="mx-2">
                  <Button
                    className="btn-primary hover:btn-hover text-md w-full font-semibold text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    disabled={!token || emailVerify.isPending}
                    type="submit"
                  >
                    {emailVerify.isPending ? (
                      <BeatLoader color="white" size={10} />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default EmailVerifyCard
