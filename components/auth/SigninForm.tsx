'use client'

import {
  FormActionButton,
  FormCard,
  FormCardBody,
  FormCardError,
  FormCardFooter,
  FormCardHeader,
} from '@/components/FormCard'
import {
  OAuthErrorDialog,
  SocialAuth,
  TwoFactorAuthDialog,
} from '@/components/auth'
import { Form } from '@/components/ui/form'
import ToastContainer from '@/components/ui/toast'
import { useSignin } from '@/hooks/auth/useSignin'
import { useTwoFactorAuth } from '@/hooks/auth/useTwoFactorAuth'
import { handleError } from '@/lib/error'
import { SigninSchema } from '@/schemas/validation'
import { Field, SigninFormData } from '@/types/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SigninForm = () => {
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: { ...defaultValues },
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const signin = useSignin()
  const twoFactorAuth = useTwoFactorAuth()
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<SigninFormData | null>(null)
  const [showOauthError, setShowOauthError] = useState(false)

  useEffect(() => {
    if (twoFactorAuth.isSuccess) {
      setOpen(true)
    }
    if (searchParams.get('error') === 'OAuthAccountNotLinked') {
      setShowOauthError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twoFactorAuth.isSuccess, searchParams])

  const onSubmit = async (formData: SigninFormData) => {
    try {
      const response = await signin.mutateAsync(formData)
      if (response.required2FA) {
        setData({ ...formData })
        await twoFactorAuth.mutateAsync(formData.email)
      } else {
        router.push('/')
      }
    } catch (error) {
      const errorMessage = handleError(error)
      setError(errorMessage)
    }
    form.reset()
  }

  return (
    <>
      {showOauthError && (
        <OAuthErrorDialog
          showOauthError={showOauthError}
          setShowOauthError={setShowOauthError}
        />
      )}
      {open && (
        <TwoFactorAuthDialog data={data} open={open} setOpen={setOpen} />
      )}
      <ToastContainer />
      <FormCard>
        <FormCardHeader header="Signin to Your Account" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormCardBody form={form} fields={fields}>
              {error && <FormCardError message={error} />}
              <FormActionButton
                label="Signin"
                isSubmitting={signin.isPending || twoFactorAuth.isPending}
              />
            </FormCardBody>
          </form>
        </Form>
        <FormCardFooter
          message="Don't have an account?"
          linkLabel="Signup"
          linkHref="/auth/signup"
        >
          <SocialAuth message="Or Signin with" />
        </FormCardFooter>
      </FormCard>
    </>
  )
}

const defaultValues: SigninFormData = {
  email: '',
  password: '',
}

const fields: Field[] = [
  { label: 'Email', placeholder: 'Enter your email', type: 'email' },
  { label: 'Password', placeholder: 'Enter your password', type: 'password' },
]

export default SigninForm
