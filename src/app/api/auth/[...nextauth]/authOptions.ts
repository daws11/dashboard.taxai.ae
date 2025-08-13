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
          // Call custom backend API for authentication
          const backendUrl = process.env.BACKEND_API_URL || 'https://tax-ai-backend-dm7p.onrender.com';
          
          console.log('🔐 Attempting backend authentication with:', backendUrl);
          
          // Use the correct login endpoint
          const loginResponse = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log('Backend login response status:', loginResponse.status);

          if (loginResponse.ok) {
            const userData = await loginResponse.json();
            console.log('✅ Backend authentication successful:', {
              userId: userData.user._id,
              email: userData.user.email,
              name: userData.user.name
            });
            
            // Validate JWT token from backend
            try {
              const backendJwtSecret = process.env.JWT_VALIDATION_SECRET || process.env.NEXTAUTH_SECRET;
              
              if (!backendJwtSecret) {
                console.warn('⚠️ JWT validation secret not found, skipping validation');
              } else {
                jwt.verify(userData.token, backendJwtSecret);
                console.log('✅ JWT token validated successfully');
              }
            } catch (jwtError) {
              const errorMessage = jwtError instanceof Error ? jwtError.message : 'Unknown JWT error';
              console.warn('⚠️ JWT validation failed, but continuing with authentication:', errorMessage);
            }
            
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
            const errorText = await loginResponse.text();
            console.log('❌ Backend authentication failed:', loginResponse.status, errorText);
            
            // Return null to indicate authentication failure
            return null;
          }
          
        } catch (error) {
          console.error('❌ Login error:', error);
          
          // Fallback to local MongoDB authentication
          try {
            console.log('🔄 Attempting local fallback authentication');
            await db;
            const user = await User.findOne({ email: credentials.email });
            if (!user) {
              console.log('❌ Local fallback user not found');
              return null;
            }
            
            console.log('✅ Local fallback user found:', { id: user._id, email: user.email, hasPassword: !!user.password });
            
            const valid = await bcrypt.compare(credentials.password, user.password);
            if (!valid) {
              console.log('❌ Local fallback password validation failed');
              return null;
            }
            console.log('✅ Local fallback authentication successful');
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
            console.error('❌ Fallback authentication failed:', fallbackError);
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