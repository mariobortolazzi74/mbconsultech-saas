import { createProject } from '../actions'
import Link from 'next/link'
import { ArrowLeft, FilePlus } from 'lucide-react'

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
          <FilePlus className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Start a New Check-up</h1>
        <p className="text-muted mb-8 text-sm max-w-xl">
          Enter the name of the facility or plant and attach the main documentation (P&ID or logic diagram) to begin validation.
        </p>
        
        <form action={createProject} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Project / Plant Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="e.g. San Raffaele Hospital - Chiller Plant"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-muted"
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
              Attach Documentation (P&ID, PDF)
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept=".pdf,.dwg,.csv,.txt"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-surface file:text-foreground file:border file:border-border hover:file:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            <p className="mt-2 text-xs text-muted">
              Supported formats: PDF, DWG, CSV, TXT. Max size: 50MB.
            </p>
          </div>
          
          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
            >
              Request Preliminary Analysis
            </button>
            <p className="mt-3 text-xs text-muted">
              The preliminary analysis is free. Payment will only be requested to unlock the full results.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
