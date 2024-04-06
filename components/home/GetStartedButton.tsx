'use client'

import { Button } from '@/components/ui'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'

const GetStartedButton = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 })

  return (
    <Link href="/auth/signin">
      <Button
        className="hover:btn-hover btn-primary rounded-full text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        size={isMobile ? 'sm' : 'lg'}
      >
        Get Started
      </Button>
    </Link>
  )
}

export default GetStartedButton
