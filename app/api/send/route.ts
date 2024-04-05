import Email from '@/components/Email'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['iyadavnishant1823@gmail.com'],
      subject: 'Hello world',
      react: Email({ firstName: 'Nishant Yadav' }),
    })

    return Response.json(data)
  } catch (error) {
    return Response.json({ error })
  }
}
