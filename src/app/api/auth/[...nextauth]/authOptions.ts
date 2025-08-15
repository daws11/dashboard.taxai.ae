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
          // First, try local MongoDB authentication (direct database access)
          console.log('🔄 Attempting local MongoDB authentication...');
          await db;
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log('❌ Local user not found for email:', credentials.email);
            return null;
          }
          
          console.log('✅ Local user found:', { 
            id: user._id, 
            emailVerified: user.emailVerified,
            subscriptionStatus: user.subscription?.status,
            hasPassword: !!user.password
          });
          
          // Check if email is verified (handle both boolean and undefined cases)
          const isEmailVerified = user.emailVerified === true || user.emailVerified === 'true';
          if (!isEmailVerified) {
            console.log('❌ Email not verified for user:', user._id, 'Status:', user.emailVerified);
            // For development/testing, allow unverified emails
            if (process.env.NODE_ENV === 'development') {
              console.log('⚠️ Development mode: Allowing unverified email');
            } else {
              return null;
            }
          }
          
          // Verify password using bcrypt
          if (!user.password) {
            console.log('❌ User has no password hash:', user._id);
            return null;
          }
          
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            console.log('❌ Invalid password for user:', user._id);
            return null;
          }
          
          console.log('✅ Password validated for user:', user._id);
          
          // Check subscription status (allow pending trial subscriptions and be more lenient)
          const subscriptionActive = user.subscription && (
            user.subscription.status === 'active' || 
            user.subscription.status === 'pending' || 
            user.subscription.type === 'trial' ||
            !user.subscription.status // Allow users without subscription status
          );
          
          if (!subscriptionActive) {
            console.log('⚠️ Subscription not active for user:', user._id, 'Status:', user.subscription?.status);
            // For development/testing, allow all subscription statuses
            if (process.env.NODE_ENV === 'development') {
              console.log('⚠️ Development mode: Allowing all subscription statuses');
            } else {
              // Only block if explicitly inactive/expired
              if (user.subscription?.status === 'inactive' || user.subscription?.status === 'expired') {
                return null;
              }
            }
          }
          
          console.log('✅ Local authentication successful for user:', user._id);
          
          // Return user data for NextAuth
          return {
            id: user._id.toString(),
            name: user.name || 'Unknown User',
            email: user.email,
            subscription: user.subscription,
            accessToken: user._id.toString(), // Local token
            jobTitle: user.jobTitle,
            language: user.language,
            trialUsed: user.trialUsed,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
          
        } catch (error) {
          console.error('❌ Local authentication failed:', error);
          
          // Fallback: try backend authentication if local fails
          try {
            console.log('🔄 Attempting backend fallback authentication...');
            const backendUrl = process.env.BACKEND_API_URL || 'https://tax-ai-backend-dm7p.onrender.com';
            
            const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });

            if (loginResponse.ok) {
              const userData = await loginResponse.json();
              console.log('✅ Backend fallback authentication successful');
              
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
            } else {
              console.log('❌ Backend fallback authentication failed:', loginResponse.status);
              return null;
            }
          } catch (fallbackError) {
            console.error('❌ Backend fallback also failed:', fallbackError);
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
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    // Use the same secret as backend for JWT operations
    secret: process.env.JWT_VALIDATION_SECRET || process.env.NEXTAUTH_SECRET,
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