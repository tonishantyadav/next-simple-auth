import { deleteVerificationToken } from '@/actions/deleteVerificationToken'
import prisma from '@/prisma/client'
import { ApiPasswordResetSchema } from '@/schemas/validation'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = ApiPasswordResetSchema.safeParse(body)

  if (!validation.success)
    return NextResponse.json(
      { error: 'Token is not provided.' },
      { status: 400 }
    )

  const { token, password } = validation.data

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return NextResponse.json({ error: 'Invalid token.' }, { status: 400 })
  }

  const hasExpired = new Date(verificationToken.expiredAt) < new Date()

  if (hasExpired) {
    await deleteVerificationToken(token)
    return NextResponse.json(
      { error: 'Token has been expired.' },
      { status: 401 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
  })

  if (!user)
    return NextResponse.json({ error: 'User doesn`t exists.' }, { status: 404 })

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })
    return NextResponse.json(
      { success: 'Password is been reset.' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reset the password! An unexpected error occcurred.' },
      { status: 500 }
    )
  }
}