"use client";

import { usePathname  } from "next/navigation";
import { AuthView } from "@neondatabase/auth-ui";


const allowedAuthViews = [
  "sign-in",
  //"sign-up",
  "reset-password",
  "sign-out",
  "callback",
  "magic-link",
  "two-factor",
] as const;

type AuthViewPath = (typeof allowedAuthViews)[number];

export default function AuthPage() {
  const pathname = usePathname();

  // /auth/sign-in -> sign-in
  // /auth/sign-up -> sign-up
  const view = pathname.split("/").filter(Boolean).at(-1) ?? "sign-in";

  const authViewPath: AuthViewPath = allowedAuthViews.includes(
    view as AuthViewPath,
  )
    ? (view as AuthViewPath)
    : "sign-in";

    //const isSignUpPage = authViewPath === "sign-up";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
       
          {/* {isSignUpPage && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">Password requirements</p>

              <p className="mt-1 text-amber-800">
                Your password must contain at least 8 characters.
              </p>
            </div>
          )} */}
          <AuthView
            pathname={authViewPath}
            path={authViewPath}
          />
      </div>
    </main>
  );
  
  /*return (
    <>
     <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
        <NeonAuthUIProvider authClient={authClient} social={{ providers: ['google'] }}>
          <AuthView pathname="sign-in" />
        </NeonAuthUIProvider>
      </div>
    </div>
    </>
    
  );*/
}