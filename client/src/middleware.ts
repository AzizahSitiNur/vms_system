import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const rolePathMap = {
  ADMIN: "/admin",
  SECURITY: "/security",
  HOST: "/host",
  GUEST: "/dashboard"
}

async function getUserRole(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || ""

  const response = await fetch(`${backendUrl}/roles/me`, {
    headers: {
      cookie: cookieHeader
    },
    cache: "no-store"
  })

  if (!response.ok) {
    return null
  }

  const user = await response.json()
  return user?.role || "GUEST"
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  let role

  try {
    role = await getUserRole(request)
  } catch {
    role = null
  }

  if (!role) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/"
    return NextResponse.redirect(loginUrl)
  }

  const expectedPath = rolePathMap[role as keyof typeof rolePathMap] || "/dashboard"

  if (pathname !== expectedPath) {
    const roleUrl = request.nextUrl.clone()
    roleUrl.pathname = expectedPath
    return NextResponse.redirect(roleUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard", "/admin", "/security", "/host"]
}