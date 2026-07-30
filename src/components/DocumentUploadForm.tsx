'use client'

import { useState } from 'react'
import { uploadProjectDocument } from '@/app/dashboard/actions'

export function DocumentUploadForm({ projectId }: { projectId: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    setError(null)
    setSuccess(false)
    
    formData.append('project_id', projectId)

    try {
      // 1. Upload to storage & DB
      const result = await uploadProjectDocument(formData)
      
      setIsUploading(false)
      setIsIngesting(true)

      // 2. Call ingestion API
      const ingestRes = await fetch('/api/ingest-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: result.documentId,
          projectId: projectId,
          storagePath: result.storagePath
        })
      })

      if (!ingestRes.ok) {
        const errorData = await ingestRes.json()
        throw new Error(errorData.error || 'Errore durante l\'elaborazione del documento')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore inaspettato')
    } finally {
      setIsUploading(false)
      setIsIngesting(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Carica Documentazione RAG</h3>
      <p className="text-sm text-zinc-400 mb-6">
        Allega un nuovo documento (PDF). Una volta caricato, l'IA estrarrà il testo e lo memorizzerà nel database vettoriale per poter interrogare i dati successivamente.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 text-sm">
          Documento caricato ed elaborato con successo! I dati sono pronti per la ricerca semantica.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="sr-only">Seleziona File</label>
          <input
            type="file"
            name="file"
            id="file"
            accept=".pdf"
            required
            disabled={isUploading || isIngesting}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading || isIngesting}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isUploading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          )}
          {isIngesting && (
            <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          )}
          
          {!isUploading && !isIngesting && 'Carica ed Elabora PDF'}
          {isUploading && 'Caricamento file...'}
          {isIngesting && 'Elaborazione IA (può richiedere tempo)...'}
        </button>
      </form>
    </div>
  )
}
