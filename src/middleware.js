import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Patient pages: add noindex header, no auth required
    if (pathname.startsWith('/p/')) {
        const response = NextResponse.next();
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return response;
    }

    // Dashboard routes: require authentication
    if (pathname.startsWith('/dashboard')) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            const signInUrl = new URL('/auth/sign-in', request.url);
            signInUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(signInUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/p/:path*'],
};
