import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple demo auth - in production this would check a real DB
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            name: "KYC Admin",
            email: credentials.email as string,
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = ["/dashboard", "/customers", "/agent"].some((p) =>
        nextUrl.pathname.startsWith(p)
      );
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
});
