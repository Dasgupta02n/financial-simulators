import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const hasGitHubOAuth = !!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
const hasGoogleOAuth = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers = [];

if (hasGitHubOAuth) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  );
}

if (hasGoogleOAuth) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  );
}

const hasAnyProvider = providers.length > 0;

export const { handlers, auth, signIn, signOut } = hasAnyProvider
  ? NextAuth({
      providers,
      session: { strategy: "jwt" },
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
          }
          return token;
        },
        async session({ session, token }) {
          if (session.user && token.id) {
            session.user.id = token.id as string;
          }
          return session;
        },
      },
      pages: { signIn: "/auth/signin" },
    })
  : {
      handlers: {
        GET: async () => new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } }),
        POST: async () => new Response(JSON.stringify({ error: "No OAuth configured" }), { status: 503, headers: { "Content-Type": "application/json" } }),
      },
      auth: async () => null,
      signIn: async () => { throw new Error("No OAuth providers configured"); },
      signOut: async () => {},
    };