import React, { ReactNode } from 'react'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
// import { GoogleAnalytics } from '@next/third-parties/google'
// import MicrosoftClarity from '@/components/microsoft-clarity'

const GoogleAnalytics = dynamic(() => import('@/components/google-analytics'), {
  ssr: false,
})

export default async function AppLayout({ children }: { children: ReactNode }) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html>
    <head>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🤖</text></svg>" />
    </head>
    <body
      className="min-h-screen w-full"
    >
    {children}

    {!isDev && <GoogleAnalytics />}
    </body>
    </html>
  )
}
