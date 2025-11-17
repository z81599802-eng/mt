import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }
        try {
          const response = await axios.post(`${apiBase}/auth/verify-otp`, {
            phone: credentials.phone,
            otp: credentials.otp,
          });
          if (!response.data?.token) {
            return null;
          }
          return {
            id: response.data.user.id,
            name: response.data.user.name ?? response.data.user.phone,
            role: response.data.user.role,
            accessToken: response.data.token,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user ?? { name: token.name ?? '' };
      (session as any).accessToken = token.accessToken;
      (session as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
});
