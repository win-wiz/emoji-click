/*
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * */
import { type NextRequest, NextResponse } from 'next/server'
import { locales, DEFAULT_LOCALE } from '@/locales/config'

export function middleware(request: NextRequest) {
  const nextUrl = (request as unknown as NextRequest).nextUrl
  const pathname = nextUrl.pathname
  const params = nextUrl.searchParams
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathname.endsWith('//')) {
    const newUrl = new URL(request.url)
    newUrl.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(newUrl)
  }
  
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${DEFAULT_LOCALE}/${pathname}?${params.toString()}`,
        request.url
      )
    )
  }

  const pathSegments = pathname.split('/');
  const uniqueSegments = [...new Set(pathSegments)]; // 去重
  if (pathSegments.length !== uniqueSegments.length) {
    return NextResponse.redirect('/' + uniqueSegments.join('/')); // 重定向到去重后的路径
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
