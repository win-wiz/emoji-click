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
    <head />
    <body
      className={clsx('min-h-screen Roboto,ui-sans-serif, system-ui, -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Helvetica Neue", arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"')}
    >
    {children}

    {!isDev && <GoogleAnalytics />}
    </body>
    </html>
  )
}
