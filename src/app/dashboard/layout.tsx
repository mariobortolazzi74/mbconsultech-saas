import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <Image src="/assets/logo.png" alt="MB Consultech Logo" width={150} height={38} className="h-10 w-auto" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-emerald-400">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md border border-zinc-700 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
