import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const response = handleI18nRouting(request);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        // Fail protected routes if Supabase is not configured
        const pathname = request.nextUrl.pathname;
        const isAuthRoute = routing.locales.some(locale => pathname.startsWith(`/${locale}/admin`) || pathname === `/${locale}/admin`);

        if (isAuthRoute) {
            const locale = pathname.split('/')[1] || 'en';
            const redirectUrl = new URL(`/${locale}/login`, request.url);
            return NextResponse.redirect(redirectUrl);
        }

        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Refresh session if needed
    const { data: { session } } = await supabase.auth.getSession()

    // Locale-aware path check
    // Paths are like /en/admin, /es/admin, etc. or just /admin if default locale is hidden (but we set always)
    const pathname = request.nextUrl.pathname;
    const isAuthRoute = routing.locales.some(locale => pathname.startsWith(`/${locale}/admin`) || pathname === `/${locale}/admin`);
    const isLoginRoute = routing.locales.some(locale => pathname.startsWith(`/${locale}/login`) || pathname === `/${locale}/login`);

    // Protect /admin routes
    if (isAuthRoute) {
        if (!session) {
            // Redirect to login with same locale
            const locale = pathname.split('/')[1]; // assuming /en/...
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    // Redirect logged-in users away from /login
    if (isLoginRoute) {
        if (session) {
            const locale = pathname.split('/')[1];
            return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - … if they start with `/api`, `/_next` or `/_vercel`
        // - … the ones containing a dot (e.g. `favicon.ico`)
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ]
};
