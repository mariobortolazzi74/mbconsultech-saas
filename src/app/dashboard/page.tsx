import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch user projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user?.id)
    .order('created_at', { ascending: false })
    
  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Il tuo Laboratorio Virtuale</h1>
          <p className="mt-2 text-zinc-400">Gestisci i tuoi progetti, apri ticket e visualizza i report diagnostici.</p>
        </div>
        <Link 
          href="/dashboard/new-project"
          className="hidden md:inline-flex py-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
        >
          + Nuovo Progetto
        </Link>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">Nuovo Progetto / Check-up</h2>
          <p className="text-sm text-zinc-400 mb-6 flex-grow">Avvia una nuova fase diagnostica caricando P&I, schemi logici e specifiche.</p>
          <Link href="/dashboard/new-project" className="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">
            Avvia Check-up
          </Link>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">I Miei Ticket</h2>
          <p className="text-sm text-zinc-400 mb-6 flex-grow">Visualizza lo stato delle tue richieste di assistenza asincrona (SLA 48h).</p>
          <Link href="/dashboard/tickets" className="w-full text-center py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-zinc-700 transition-colors">
            Apri Helpdesk
          </Link>
        </div>
      </div>
      
      <section>
        <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">I tuoi Progetti Attivi</h2>
        
        {!projects || projects.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-8 text-center">
            <p className="text-zinc-500 mb-4">Nessun progetto trovato. Inizia richiedendo il tuo primo check-up diagnostico.</p>
            <Link href="/dashboard/new-project" className="text-emerald-400 font-medium hover:text-emerald-300">
              Crea il primo progetto &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <ul className="divide-y divide-zinc-800">
              {projects.map((project: any) => (
                <li key={project.id} className="p-4 hover:bg-zinc-800/50 transition-colors flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">{project.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Creato il: {new Date(project.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
