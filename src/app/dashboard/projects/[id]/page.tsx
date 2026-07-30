import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DocumentUploadForm } from '@/components/DocumentUploadForm'
import { simulatePayment, simulateAnalysisComplete } from '../../actions'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch project
  const { data: project } = await supabase
    .from('mbc_projects')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!project) {
    redirect('/dashboard')
  }

  // Fetch documents for this project
  const { data: documents } = await supabase
    .from('mbc_documents')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  const isAnalisi = project.status === 'analisi_preliminare' || project.status === 'active'
  const isDaPagare = project.status === 'da_pagare'
  const isCompletato = project.status === 'completato'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300">
          &larr; Torna alla Dashboard
        </Link>
        
        {/* Test Buttons for Advisor/Dev */}
        <div className="flex gap-2">
          {isAnalisi && (
            <form action={simulateAnalysisComplete.bind(null, project.id)}>
              <button type="submit" className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded hover:bg-zinc-700">
                [TEST] Segna come "Da Pagare"
              </button>
            </form>
          )}
        </div>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
            {project.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <p className="text-zinc-400 text-sm">
          Creato il {new Date(project.created_at).toLocaleDateString('it-IT')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* FASE: DA PAGARE (PRESA VISIONE) */}
          {isDaPagare && (
            <section className="bg-zinc-900 border border-emerald-900/50 rounded-xl p-6 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <h2 className="text-xl font-bold text-white mb-4">Analisi Completata</h2>
              <p className="text-zinc-300 text-sm mb-6">
                I nostri sistemi hanno completato l'elaborazione dei tuoi documenti. Abbiamo individuato alcune aree critiche che richiedono la tua attenzione.
              </p>
              
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 mb-6">
                <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Criticità Preliminari Individuate
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    Incongruenza rilevata nelle specifiche di pressione del serbatoio T-101.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    Manca certificazione aggiornata per la valvola di sicurezza V-203.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-500 mt-0.5">•</span>
                    <span className="blur-sm select-none">Ulteriore criticità grave sulla linea principale, con rischio di sversamento secondo le norme di sicurezza vigenti.</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <form action={simulatePayment.bind(null, project.id)}>
                  <button type="submit" className="w-full sm:w-auto py-3 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    Sblocca Report Completo (Paga Ora)
                  </button>
                </form>
                <p className="mt-3 text-xs text-zinc-500">
                  (Questo è un bottone di test che simula il pagamento avvenuto)
                </p>
              </div>
            </section>
          )}

          {/* FASE: COMPLETATO */}
          {isCompletato && (
            <section className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Documentazione Sbloccata
              </h2>
              <p className="text-zinc-300 text-sm mb-4">
                Grazie per il pagamento. Ora hai accesso completo a tutti i ticket generati e ai report dettagliati.
              </p>
              <button className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700">
                Scarica Report PDF
              </button>
            </section>
          )}

          {/* FASE: IN ANALISI */}
          {isAnalisi && (
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-lg font-semibold text-white">Analisi in corso...</h2>
              </div>
              <p className="text-zinc-400 text-sm">
                I nostri consulenti e sistemi IA stanno analizzando i tuoi documenti. Riceverai una notifica non appena l'analisi preliminare sarà pronta per la visione.
              </p>
            </section>
          )}

          {/* Documents List */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Archivio Documenti</h2>
            
            {!documents || documents.length === 0 ? (
              <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-8 text-center">
                <p className="text-zinc-500">Nessun documento caricato per questo progetto.</p>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <ul className="divide-y divide-zinc-800">
                  {documents.map((doc: any) => (
                    <li key={doc.id} className="p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{doc.file_name}</p>
                          <p className="text-xs text-zinc-500">
                            Caricato il {new Date(doc.created_at).toLocaleDateString('it-IT')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">RAG Attivo</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          {/* Upload Form - Nascosto se completato o da pagare per evitare confusione */}
          {isAnalisi ? (
            <DocumentUploadForm projectId={project.id} />
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-zinc-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <h3 className="text-white font-medium mb-1">Upload Disabilitato</h3>
              <p className="text-sm text-zinc-500">
                Non puoi aggiungere ulteriori documenti in questa fase del progetto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
