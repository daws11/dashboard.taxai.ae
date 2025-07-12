import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/app/api/_utils/mongoClient";
import db from "@/app/api/_utils/db";
import User from "@/app/api/_models/User";
import bcrypt from "bcryptjs";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { SessionStrategy } from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import jwt from "jsonwebtoken";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await db;
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy, maxAge: 60 * 60 * 24 },
  pages: {
    signIn: "/", // redirect to login page
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? (process.env.COOKIE_DOMAIN || '.taxai.ae') : undefined,
      },
    },
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.sub;
        ((session as unknown) as Record<string, unknown>).accessToken = token.accessToken;
        (session.user as Record<string, unknown>).email = token.email;
        if ((token as Record<string, unknown>).ssoJwt) {
          ((session as unknown) as Record<string, unknown>).ssoJwt = (token as Record<string, unknown>).ssoJwt;
        }
      }
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: NextAuthUser | AdapterUser;
      account?: unknown;
      profile?: unknown;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: unknown;
    }) {
      if (user && typeof user === 'object' && 'email' in user) {
        token.accessToken = token.sub;
        token.email = user.email as string;
        const payload = {
          id: (user.id || token.sub) as string,
          email: user.email as string,
        };
        token.ssoJwt = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn: '24h' });
      }
      return token;
    },
  },
}; 