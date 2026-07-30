import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Home, FolderOpen, LifeBuoy, Settings, LogOut } from 'lucide-react'

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

  // Get first letter of email for avatar
  const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-surface flex flex-col justify-between sticky top-0 h-screen">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/dashboard">
              <Image src="/assets/logo.png" alt="MB Consultech Logo" width={150} height={38} className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-800/50 text-foreground text-sm font-medium transition-colors border border-border">
              <Home className="w-4 h-4 text-emerald-500" />
              Home
            </Link>
            <Link href="/dashboard/tickets" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted hover:text-foreground hover:bg-zinc-800/30 text-sm font-medium transition-colors">
              <LifeBuoy className="w-4 h-4" />
              Support
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted hover:text-foreground hover:bg-zinc-800/30 text-sm font-medium transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>

        {/* User Widget Bottom */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                {initial}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-foreground truncate">
                  {user.email}
                </span>
                <span className="text-xs text-muted truncate">
                  Free Plan
                </span>
              </div>
            </div>
            <form action="/auth/signout" method="post" className="flex-shrink-0 ml-2">
              <button
                type="submit"
                className="p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
