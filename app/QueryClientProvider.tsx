'use client'

import {
  QueryClientProvider as BaseQueryClientProvider,
  QueryClient,
} from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

const queryClient = new QueryClient()

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </BaseQueryClientProvider>
  )
}

export default QueryClientProvider
