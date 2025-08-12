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
        
        try {
          // Call custom backend API for authentication
          const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            return {
              id: userData.user._id || userData.user.id,
              name: userData.user.name,
              email: userData.user.email,
              subscription: userData.user.subscription,
              accessToken: userData.token,
              jobTitle: userData.user.jobTitle,
              language: userData.user.language,
              trialUsed: userData.user.trialUsed,
              createdAt: userData.user.createdAt,
              updatedAt: userData.user.updatedAt,
            };
          }
          
          // Fallback to local MongoDB if backend API fails
          console.warn('Backend API failed, falling back to local authentication');
          await db;
          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            subscription: user.subscription,
            accessToken: user._id.toString(), // Fallback token
            jobTitle: user.jobTitle,
            language: user.language,
            trialUsed: user.trialUsed,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error('Login error:', error);
          
          // Fallback to local MongoDB authentication
          try {
            await db;
            const user = await User.findOne({ email: credentials.email });
            if (!user) return null;
            const valid = await bcrypt.compare(credentials.password, user.password);
            if (!valid) return null;
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              subscription: user.subscription,
              accessToken: user._id.toString(), // Fallback token
              jobTitle: user.jobTitle,
              language: user.language,
              trialUsed: user.trialUsed,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };
          } catch (fallbackError) {
            console.error('Fallback authentication failed:', fallbackError);
            return null;
          }
        }
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
        // Add additional user data to session
        if (token.subscription) {
          ((session as unknown) as Record<string, unknown>).subscription = token.subscription;
        }
        if (token.jobTitle) {
          (session.user as Record<string, unknown>).jobTitle = token.jobTitle;
        }
        if (token.language) {
          (session.user as Record<string, unknown>).language = token.language;
        }
        if (token.trialUsed !== undefined) {
          (session.user as Record<string, unknown>).trialUsed = token.trialUsed;
        }
        if (token.createdAt) {
          (session.user as Record<string, unknown>).createdAt = token.createdAt;
        }
        if (token.updatedAt) {
          (session.user as Record<string, unknown>).updatedAt = token.updatedAt;
        }
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
        // Safely access user properties with proper type checking
        const userObj = user as NextAuthUser & Record<string, unknown>;
        
        token.accessToken = (userObj.accessToken as string) || token.sub;
        token.email = user.email as string;
        
        // Store additional user data in JWT token with safe property access
        if (userObj.subscription) {
          (token as JWT & Record<string, unknown>).subscription = userObj.subscription;
        }
        if (userObj.jobTitle) {
          (token as JWT & Record<string, unknown>).jobTitle = userObj.jobTitle;
        }
        if (userObj.language) {
          (token as JWT & Record<string, unknown>).language = userObj.language;
        }
        if (userObj.trialUsed !== undefined) {
          (token as JWT & Record<string, unknown>).trialUsed = userObj.trialUsed;
        }
        if (userObj.createdAt) {
          (token as JWT & Record<string, unknown>).createdAt = userObj.createdAt;
        }
        if (userObj.updatedAt) {
          (token as JWT & Record<string, unknown>).updatedAt = userObj.updatedAt;
        }
        
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