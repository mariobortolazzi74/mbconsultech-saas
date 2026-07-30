'use client'

import { useState } from 'react'
import { uploadProjectDocument } from '@/app/dashboard/actions'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

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
        throw new Error(errorData.error || 'Error processing document')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsUploading(false)
      setIsIngesting(false)
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
          <UploadCloud className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Upload RAG Documentation</h3>
      </div>
      
      <p className="text-sm text-muted mb-6 leading-relaxed">
        Attach a new PDF document. Once uploaded, the AI will extract the text and store it in the vector database to allow querying later.
      </p>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Document successfully uploaded and processed! Data is ready for semantic search.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="sr-only">Select File</label>
          <input
            type="file"
            name="file"
            id="file"
            accept=".pdf"
            required
            disabled={isUploading || isIngesting}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-surface file:text-foreground file:border file:border-border hover:file:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isUploading || isIngesting}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-surface disabled:border-border disabled:text-muted disabled:border text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {(isUploading || isIngesting) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          
          {!isUploading && !isIngesting && 'Upload & Process PDF'}
          {isUploading && 'Uploading file...'}
          {isIngesting && 'AI Processing (may take time)...'}
        </button>
      </form>
    </div>
  )
}
