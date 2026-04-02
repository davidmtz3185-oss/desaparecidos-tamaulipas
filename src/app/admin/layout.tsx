import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // La página de login no necesita el layout completo
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {session && <AdminSidebar user={session.user} />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
