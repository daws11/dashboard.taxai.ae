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
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        console.log('🔐 NextAuth authorize called with:', { email: credentials.email, password: '***' });
        
        try {
          // Simple local MongoDB authentication
          console.log('🔄 Attempting local MongoDB authentication...');
          await db;
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log('❌ Local user not found for email:', credentials.email);
            return null;
          }
          
          console.log('✅ Local user found:', { 
            id: user._id, 
            email: user.email,
            hasPassword: !!user.password,
            passwordLength: user.password ? user.password.length : 0
          });
          
          // Simple password validation - no additional checks
          if (!user.password) {
            console.log('❌ User has no password hash');
            return null;
          }
          
          // Debug password comparison
          console.log('🔍 Comparing passwords...');
          console.log('Input password length:', credentials.password.length);
          console.log('Stored hash length:', user.password.length);
          
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          console.log('Password validation result:', isValidPassword);
          
          if (!isValidPassword) {
            console.log('❌ Password validation failed');
            return null;
          }
          
          console.log('✅ Password validated successfully');
          
          // Return user data without additional validations
          return {
            id: user._id.toString(),
            name: user.name || 'Unknown User',
            email: user.email,
            subscription: user.subscription,
            accessToken: user._id.toString(),
            jobTitle: user.jobTitle,
            language: user.language,
            trialUsed: user.trialUsed,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
          
        } catch (error) {
          console.error('❌ Local authentication failed:', error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy, maxAge: 60 * 60 * 24 },
  pages: {
    signIn: "/", // redirect to login page
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    // Use NextAuth's own secret for JWT operations
    secret: process.env.NEXTAUTH_SECRET,
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
        
        // Generate SSO JWT using the same secret as backend
        const backendJwtSecret = process.env.JWT_VALIDATION_SECRET || process.env.NEXTAUTH_SECRET;
        
        if (backendJwtSecret) {
          const payload = {
            id: (user.id || token.sub) as string,
            email: user.email as string,
          };
          token.ssoJwt = jwt.sign(payload, backendJwtSecret, { expiresIn: '24h' });
        } else {
          console.warn('⚠️ JWT validation secret not found, skipping SSO JWT generation');
        }
      }
      return token;
    },
  },
}; 