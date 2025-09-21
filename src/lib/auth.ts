import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabase } from '@/integrations/supabase/client';

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.VITE_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email,
            image: data.user.user_metadata?.avatar_url,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      if (account?.provider === 'google') {
        // Sincronizar con Supabase cuando se autentica con Google
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: account.id_token!,
        });
        
        if (!error && data.user) {
          token.supabaseId = data.user.id;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; supabaseId?: string }).id = token.id as string;
        (session.user as { id?: string; supabaseId?: string }).supabaseId = token.supabaseId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Función helper para obtener la sesión del servidor
export async function getServerSession() {
  // Esta función se implementará cuando se configure el servidor NextAuth
  return null;
}

// Función helper para el cliente
export function useSession() {
  // Esta función se implementará con el hook de NextAuth
  return { data: null, status: 'loading' };
}