import {
  SigninSchema,
  SignupSchema,
  VerificationSchema,
} from '@/schemas/userValidation'
import React from 'react'
import { z } from 'zod'

export type SigninFormData = z.infer<typeof SigninSchema>
export type SignupFormData = z.infer<typeof SignupSchema>
export type VerificationFormData = z.infer<typeof VerificationSchema>

export interface Field {
  label: string
  placeholder: string
  type: 'email' | 'password' | 'text'
}

export interface FormBody {
  children: React.ReactNode
  onSubmit: (data: SigninFormData | SignupFormData) => Promise<void>
  fields: Field[]
  schema: typeof SigninSchema | typeof SignupSchema
  defaultValues: SigninFormData | SignupFormData
}