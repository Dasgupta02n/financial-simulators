"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

// SessionProvider is required because 25+ components call useSession().
// The /api/auth/[...nextauth] route already returns {} when no OAuth providers
// are configured, so SessionProvider won't crash on deployments without auth.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>{children}</SessionProvider>;
}