import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PAGE_ROUTES, LOCAL_STORAGE_KEY } from '@/app/constants/common'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN)?.value
  const { pathname } = request.nextUrl

  // Define route groups
  const authRoutes = [PAGE_ROUTES.LOGIN, PAGE_ROUTES.SIGNUP]
  const protectedRoutes = [PAGE_ROUTES.DASHBOARD]

  // 1. If user is logged in and trying to access login/signup, Redirect to Dashboard
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.DASHBOARD, request.url))
  }

  // 2. If user is NOT logged in and trying to access protected pages, Redirect to Login
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
  ],
}


