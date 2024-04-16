import { SigninFormData } from '@/types/form'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export const useSignin = () => {
  return useMutation({
    mutationFn: async (data: SigninFormData) => {
      await axios.post('/api/auth/signin', data)
    },
  })
}
