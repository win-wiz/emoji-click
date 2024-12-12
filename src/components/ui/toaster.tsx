'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '0.75rem',
        },
        className: 'font-sans',
      }}
    />
  )
} 