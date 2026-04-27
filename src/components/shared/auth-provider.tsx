"use client";

import type { ReactNode } from "react";

// SessionProvider is only needed when OAuth is configured.
// Without it, the client won't call /api/auth/session on every page load,
// eliminating the 500 error that crashes the React tree on Railway.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}