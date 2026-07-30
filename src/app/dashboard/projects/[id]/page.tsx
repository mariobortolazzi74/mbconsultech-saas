import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DocumentUploadForm } from '@/components/DocumentUploadForm'

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300">
          &larr; Torna alla Dashboard
        </Link>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">
            {project.status.toUpperCase()}
          </span>
        </div>
        <p className="text-zinc-400 text-sm">
          Creato il {new Date(project.created_at).toLocaleDateString('it-IT')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Documents List */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Documenti Caricati</h2>
            
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
          {/* Upload Form */}
          <DocumentUploadForm projectId={project.id} />
        </div>
      </div>
    </div>
  )
}
