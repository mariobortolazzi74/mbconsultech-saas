import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, ArrowRight, FolderKanban, LifeBuoy } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user projects
  const { data: projects } = await supabase
    .from('mbc_projects')
    .select('*')
    .eq('client_id', user?.id)
    .order('created_at', { ascending: false })
    
  return (
    <div>
      <header className="mb-8 flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Virtual Laboratory</h1>
          <p className="mt-2 text-sm text-muted">Manage your projects, open support tickets, and view diagnostic reports.</p>
        </div>
        <Link 
          href="/dashboard/new-project"
          className="hidden md:inline-flex items-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-emerald-500/50 transition-colors flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
            <FolderKanban className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">New Project / Check-up</h2>
          <p className="text-sm text-muted mb-6 flex-grow">Start a new diagnostic phase by uploading P&ID, logic diagrams, and specifications.</p>
          <Link href="/dashboard/new-project" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-500 group-hover:text-emerald-400 transition-colors">
            Start Check-up <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-emerald-500/50 transition-colors flex flex-col group">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
            <LifeBuoy className="w-5 h-5 text-zinc-400" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">My Tickets</h2>
          <p className="text-sm text-muted mb-6 flex-grow">View the status of your asynchronous support requests (48h SLA).</p>
          <Link href="/dashboard/tickets" className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-zinc-300 transition-colors">
            Open Helpdesk <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Active Projects</h2>
        
        {!projects || projects.length === 0 ? (
          <div className="bg-surface border border-border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <FolderKanban className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-foreground font-medium mb-1">No projects found</h3>
            <p className="text-sm text-muted mb-6 max-w-sm">You haven't requested any diagnostic check-ups yet. Start your first project now.</p>
            <Link href="/dashboard/new-project" className="inline-flex py-2 px-4 bg-foreground hover:bg-zinc-200 text-background text-sm font-medium rounded-md transition-colors">
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-border">
              {projects.map((project: any) => (
                <li key={project.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <Link href={`/dashboard/projects/${project.id}`} className="p-4 flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/30 transition-colors">
                        <FolderKanban className="w-5 h-5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{project.name}</h3>
                        <p className="text-xs text-muted mt-1">
                          Created on {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        {project.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
