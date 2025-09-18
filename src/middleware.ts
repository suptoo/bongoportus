import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/admin', '/user'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const token = request.cookies.get('bp_session')?.value;
    const secret = process.env.AUTH_SECRET || 'dev-secret-change-me';
    const payload = token ? await verifyJWT(token, secret) : null;
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth';
      // Preserve full path including search for better UX
      const full = pathname + (request.nextUrl.search || '');
      url.searchParams.set('next', full);
      return NextResponse.redirect(url);
    }
    // Role-based base path enforcement
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/user';
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith('/user') && payload.role === 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};