import { createClient } from '@/utils/supabase/server'
import { createTicket } from '../actions'
import Link from 'next/link'

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: { success: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch projects for the dropdown
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .eq('client_id', user?.id)
    
  // Fetch user tickets
  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, projects(name)')
    .order('created_at', { ascending: false })
    
  // Filter tickets manually since the RLS policy already filters them, 
  // but just in case. (RLS policy ensures users only see tickets for their projects)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300">
          &larr; Torna alla Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Centro Assistenza Asincrona</h1>
      </div>
      
      {searchParams?.success && (
        <div className="mb-8 p-4 bg-emerald-900/20 border border-emerald-900 rounded-lg">
          <p className="text-emerald-400 font-medium">Ticket aperto con successo! Ti risponderemo entro le SLA stabilite.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Apri un Ticket</h2>
            
            <form action={createTicket} className="space-y-4">
              <div>
                <label htmlFor="project_id" className="block text-sm font-medium text-zinc-300 mb-1">
                  Seleziona Progetto
                </label>
                <select 
                  name="project_id" 
                  id="project_id"
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Seleziona un progetto...</option>
                  {projects?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                  Oggetto
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
                  Richiesta Dettagliata
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-zinc-700 transition-colors"
              >
                Invia Ticket
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4">Storico Ticket</h2>
          
          {!tickets || tickets.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-8 text-center text-zinc-500">
              Non hai ancora aperto nessun ticket per i tuoi progetti.
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket: any) => (
                <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{ticket.title}</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      ticket.status === 'open' ? 'bg-amber-900/40 text-amber-500' :
                      ticket.status === 'in_progress' ? 'bg-blue-900/40 text-blue-400' :
                      'bg-emerald-900/40 text-emerald-400'
                    }`}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mb-4">
                    Progetto: <span className="font-medium text-zinc-400">{ticket.projects?.name}</span> • 
                    Aperto il: {new Date(ticket.created_at).toLocaleDateString('it-IT')}
                  </div>
                  
                  <p className="text-sm text-zinc-300 line-clamp-3 mb-4">
                    {ticket.description}
                  </p>
                  
                  {ticket.diagnostic_summary && (
                    <div className="mt-4 p-4 bg-zinc-950 border-l-2 border-emerald-500 rounded-r-md">
                      <p className="text-xs font-bold text-emerald-500 mb-1">RISPOSTA / DIAGNOSI:</p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{ticket.diagnostic_summary}</p>
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
