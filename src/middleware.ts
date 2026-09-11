import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protects the /admin route.
 *
 * Rules:
 *  - If ADMIN_PASSWORD is set, a username/password prompt must be passed.
 *  - If it is NOT set, /admin is reachable only while developing locally.
 *    In production an unset password means the page is hidden completely,
 *    so an unprotected dashboard can never be exposed by accident.
 */
export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD ?? '';
  const isProduction = process.env.NODE_ENV === 'production';

  if (!password) {
    if (isProduction) {
      return new NextResponse('Not found', { status: 404 });
    }
    return NextResponse.next();
  }

  const header = request.headers.get('authorization') ?? '';

  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const separator = decoded.indexOf(':');
      const supplied = separator === -1 ? '' : decoded.slice(separator + 1);
      if (safeEqual(supplied, password)) {
        return NextResponse.next();
      }
    } catch {
      // A malformed header is simply treated as a failed attempt.
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Digital Grave Admin"' },
  });
}

/** Compares two strings without leaking how much of them matched. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export const config = {
  matcher: ['/admin/:path*'],
};
