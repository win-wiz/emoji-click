'use client'

import React, { useEffect } from 'react'
import clsx from 'clsx'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={clsx('min-h-screen font-sans antialiased bg-black')}
      >
        <main>
          <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
            <div className="max-w-lg mx-auto space-y-3 text-center">
              <h3 className="text-primary font-semibold">
                503 Server Error
              </h3>
              <p className="text-white text-4xl font-semibold sm:text-5xl">
                Server Error
              </p>
              <p className="text-white">
                Sorry, the page you are looking for could not be found or has
                been removed.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/"
                  className="block py-2 px-4 text-white font-medium bg-indigo-600 duration-150 hover:bg-primary active:bg-primary rounded-lg"
                >
                  Go back
                </a>
                <a
                  href="/"
                  className="block py-2 px-4 text-white hover:bg-primary font-medium duration-150 active:bg-gray-100 border rounded-lg"
                >
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
