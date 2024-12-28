import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env";
import { db } from "~/server/db";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      clientId: env.GOOGLE_CLIENT_ID,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authConfig);
