import { createProject } from '../actions'
import Link from 'next/link'

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300">
          &larr; Torna alla Dashboard
        </Link>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Avvia un nuovo Check-up</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          Inserisci il nome del cantiere o dell'impianto e allega il documento principale (P&I o schema logico) per iniziare la validazione.
        </p>
        
        <form action={createProject} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
              Nome Progetto / Impianto
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Es. Ospedale San Raffaele - Centrale Frigo"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-zinc-300 mb-2">
              Allega Documentazione (P&I, PDF)
            </label>
            <input
              type="file"
              name="file"
              id="file"
              accept=".pdf,.dwg,.csv,.txt"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Formati supportati: PDF, DWG, CSV, TXT. Dimensione massima: 50MB.
            </p>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              Richiedi Analisi Preliminare
            </button>
            <p className="mt-3 text-center text-xs text-zinc-400">
              L'analisi preliminare è gratuita. Il pagamento verrà richiesto solo per sbloccare i risultati completi.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
