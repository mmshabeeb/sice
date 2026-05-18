import { NextResponse, type NextRequest } from 'next/server';

const DASHBOARD_ROLES = ['creator', 'merchant', 'admin'] as const;

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get('session')?.value;

  const isDashboard = path.startsWith('/dashboard');
  const isLogin = path === '/login';

  // Redirect unauthenticated users away from dashboard
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login
  // (role redirect happens client-side after sign-in; just send to /dashboard)
  if (isLogin && session) {
    // Detect which role sub-path to use from the URL they came from, or default to creator
    const from = request.nextUrl.searchParams.get('from');
    const role = DASHBOARD_ROLES.find((r) => from?.startsWith(`/dashboard/${r}`)) ?? 'creator';
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
