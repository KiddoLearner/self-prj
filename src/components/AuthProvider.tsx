"use client";

import type { ReactNode } from "react";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "@/src/lib/auth/client";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <NeonAuthUIProvider authClient={authClient}
     // social={{ providers: ["google"] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}