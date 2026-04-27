"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => setAuthenticated(res.ok))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAuthenticated(true);
      } else if (res.status === 429) {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <p className="text-text-secondary text-sm font-mono">Checking session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 rounded-lg border border-border bg-surface">
          <h1 className="text-lg font-semibold text-text-primary mb-4">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-3 py-2 rounded-md bg-ink border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-gain"
          />
          {error && <p className="text-loss text-xs mt-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2 rounded-md bg-gain text-ink text-sm font-semibold hover:bg-gain/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return <AdminLayout />;
}