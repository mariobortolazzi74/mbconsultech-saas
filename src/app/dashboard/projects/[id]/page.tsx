import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DocumentUploadForm } from '@/components/DocumentUploadForm'
import { simulatePayment, simulateAnalysisComplete } from '../../actions'
import { ArrowLeft, CheckCircle, AlertTriangle, FileText, Lock, FileArchive, Loader2 } from 'lucide-react'

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
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        {/* Test Buttons for Advisor/Dev */}
        <div className="flex gap-2">
          {isAnalisi && (
            <form action={simulateAnalysisComplete.bind(null, project.id)}>
              <button type="submit" className="text-xs bg-surface border border-border text-muted px-3 py-1.5 rounded-md hover:text-foreground hover:bg-zinc-800 transition-colors">
                [TEST] Mark as "To Pay"
              </button>
            </form>
          )}
        </div>
      </div>

      <header className="mb-8 pb-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2 justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <p className="text-muted text-sm mt-1">
          Created on {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* PHASE: TO PAY (PRELIMINARY RESULTS) */}
          {isDaPagare && (
            <section className="bg-surface border border-emerald-500/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-semibold text-foreground">Analysis Completed</h2>
              </div>
              <p className="text-muted text-sm mb-6 leading-relaxed">
                Our systems have finished processing your documents. We have identified several critical areas that require your attention.
              </p>
              
              <div className="bg-background border border-border rounded-lg p-5 mb-6">
                <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Preliminary Critical Findings
                </h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                    <span>Inconsistency detected in the pressure specifications of tank T-101.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                    <span>Missing updated certification for safety valve V-203.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 flex-shrink-0"></div>
                    <span className="blur-sm select-none">Additional severe critical issue on the main line, with spill risk according to current safety regulations.</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <div className="text-sm text-muted">
                  Unlock the full detailed report to see all findings.
                </div>
                <form action={simulatePayment.bind(null, project.id)}>
                  <button type="submit" className="w-full sm:w-auto py-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Unlock Full Report (Pay Now)
                  </button>
                  <p className="mt-2 text-[10px] text-zinc-500 text-center sm:text-right">
                    (Test button simulating payment)
                  </p>
                </form>
              </div>
            </section>
          )}

          {/* PHASE: COMPLETED */}
          {isCompletato && (
            <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-semibold text-foreground">Documentation Unlocked</h2>
              </div>
              <p className="text-muted text-sm mb-6 leading-relaxed">
                Thank you for your payment. You now have full access to all generated tickets and detailed reports.
              </p>
              <button className="py-2.5 px-4 bg-background hover:bg-zinc-800 text-foreground text-sm font-medium rounded-lg transition-colors border border-border flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Download PDF Report
              </button>
            </section>
          )}

          {/* PHASE: IN ANALYSIS */}
          {isAnalisi && (
            <section className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                <h2 className="text-lg font-semibold text-foreground">Analysis in progress...</h2>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Our consultants and AI systems are currently analyzing your documents. You will receive a notification as soon as the preliminary analysis is ready for review.
              </p>
            </section>
          )}

          {/* Documents List */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Document Archive</h2>
            
            {!documents || documents.length === 0 ? (
              <div className="bg-surface border border-border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <FileArchive className="w-8 h-8 text-muted mb-3" />
                <p className="text-muted text-sm">No documents uploaded for this project yet.</p>
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                <ul className="divide-y divide-border">
                  {documents.map((doc: any) => (
                    <li key={doc.id} className="p-4 flex justify-between items-center hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted" />
                        </div>
                        <div>
                          <p className="text-foreground text-sm font-medium">{doc.file_name}</p>
                          <p className="text-xs text-muted mt-1">
                            Uploaded on {new Date(doc.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-border">
                        Active RAG
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          {/* Upload Form - Hidden if completed or to pay to avoid confusion */}
          {isAnalisi ? (
            <DocumentUploadForm projectId={project.id} />
          ) : (
            <div className="bg-surface border border-border rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="text-foreground font-medium mb-2">Upload Disabled</h3>
              <p className="text-sm text-muted leading-relaxed">
                You cannot attach additional documents during this phase of the project.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
