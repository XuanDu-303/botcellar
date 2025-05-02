import type { NextAuthConfig } from 'next-auth'

const protectedPaths = [/^\/checkout/, /^\/account/, /^\/admin/]

export default {
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (protectedPaths.some((regex) => regex.test(pathname))) {
        return !!auth
      }
      return true
    },
  },
} satisfies NextAuthConfig