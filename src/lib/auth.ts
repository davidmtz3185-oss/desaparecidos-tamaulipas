import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const admin = await prisma.adminUser.findUnique({
          where: { email },
          select: { id: true, email: true, nombre: true, passwordHash: true, rol: true, activo: true },
        })
        if (!admin || !admin.activo) return null
        const passwordOk = await bcrypt.compare(password, admin.passwordHash)
        if (!passwordOk) return null

        return {
          id: admin.id,
          email: admin.email,
          name: admin.nombre,
          role: admin.rol,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
})
