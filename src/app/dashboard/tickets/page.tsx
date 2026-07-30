import { createClient } from '@/utils/supabase/server'
import { createTicket } from '../actions'
import Link from 'next/link'
import { ArrowLeft, LifeBuoy, AlertCircle, MessageSquare } from 'lucide-react'

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: { success: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch projects for the dropdown
  const { data: projects } = await supabase
    .from('mbc_projects')
    .select('id, name')
    .eq('client_id', user?.id)
    
  // Fetch user tickets
  const { data: tickets } = await supabase
    .from('mbc_tickets')
    .select('*, mbc_projects(name)')
    .order('created_at', { ascending: false })
    
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <header className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <LifeBuoy className="w-6 h-6 text-zinc-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Asynchronous Helpdesk</h1>
        </div>
      </header>
      
      {searchParams?.success && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-emerald-400 text-sm font-medium">Ticket opened successfully! We will reply within the established SLAs.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-xl p-6 sticky top-8 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">Open a Ticket</h2>
            
            <form action={createTicket} className="space-y-4">
              <div>
                <label htmlFor="project_id" className="block text-sm font-medium text-foreground mb-2">
                  Select Project
                </label>
                <select 
                  name="project_id" 
                  id="project_id"
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option value="">Select a project...</option>
                  {projects?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Detailed Request
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors mt-2"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-6">Ticket History</h2>
          
          {!tickets || tickets.length === 0 ? (
            <div className="bg-surface border border-border border-dashed rounded-xl p-8 text-center flex flex-col items-center">
              <MessageSquare className="w-8 h-8 text-muted mb-3" />
              <p className="text-muted text-sm">You haven't opened any tickets for your projects yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket: any) => (
                <div key={ticket.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-foreground font-medium">{ticket.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border tracking-wider ${
                      ticket.status === 'open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      ticket.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-muted mb-4">
                    Project: <span className="font-medium text-foreground">{ticket.mbc_projects?.name}</span> &bull; 
                    Opened on: {new Date(ticket.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  
                  <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                    {ticket.description}
                  </p>
                  
                  {ticket.diagnostic_summary && (
                    <div className="mt-4 p-4 bg-background border border-border border-l-2 border-l-emerald-500 rounded-r-lg">
                      <p className="text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">REPLY / DIAGNOSIS:</p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">{ticket.diagnostic_summary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
