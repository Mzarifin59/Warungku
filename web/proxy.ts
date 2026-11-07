import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (Next 16, pengganti `middleware.ts`):
 * - refresh session Supabase di setiap request (cookie),
 * - guard rute `/mitra/*` → redirect ke `/login?next=...` bila belum login,
 * - user yang sudah login dan membuka `/login` atau `/daftar` diarahkan ke
 *   dashboard.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && pathname.startsWith("/mitra")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/daftar")) {
    const next = request.nextUrl.searchParams.get("next");
    const target =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/mitra/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
