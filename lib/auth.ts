import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const password = credentials.password as string;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
          throw new Error('ADMIN_PASSWORD not configured');
        }

        // In production, compare hashed passwords
        // For simplicity, using direct comparison (you should hash in production)
        if (password === adminPassword) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@kjebi.app',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});
