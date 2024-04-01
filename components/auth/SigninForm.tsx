'use client'

import {
  FormActionButton,
  FormCard,
  FormCardBody,
  FormCardError,
  FormCardFooter,
  FormCardHeader,
} from '@/components/FormCard'
import { handleError } from '@/lib/handleError'
import { SigninSchema } from '@/schemas/userValidation'
import { Field, SigninFormData } from '@/types/formCard'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SigninForm = () => {
  const router = useRouter()
  const [error, setError] = useState('')

  const onSubmit = async (data: SigninFormData) => {
    try {
      await axios.post('/api/auth/signin', data)
      router.push('/')
    } catch (error) {
      const err = handleError(error)
      setError(err)
    }
  }

  return (
    <FormCard>
      <FormCardHeader header="Signin to your account" />
      <FormCardBody
        onSubmit={onSubmit}
        fields={fields}
        schema={SigninSchema}
        defaultValues={defaultValues}
      >
        <FormActionButton label="Login" />
        {error && <FormCardError message={error} />}
      </FormCardBody>
      <FormCardFooter
        message="Don't have an account?"
        linkLabel="Signup"
        linkHref="/auth/signup"
      />
    </FormCard>
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