import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Skip middleware for API routes, _next, static files
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.includes('.') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Main domain - show normal routing
  const isMainDomain =
    hostname === 'pageiz.me' ||
    hostname === 'www.pageiz.me' ||
    hostname.includes('localhost') ||
    hostname.includes('13.125.150.235');

  if (isMainDomain) {
    return NextResponse.next();
  }

  // Custom domain or subdomain - rewrite to custom domain handler
  // Store the custom hostname in a header so the page can access it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-custom-domain', hostname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
