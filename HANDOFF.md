# MB Consultech SaaS - Project Handoff

Questo documento serve a fornire il contesto completo all'assistente AI per la prossima sessione di lavoro. Il progetto si trova nella cartella locale `/Users/mariobortolazzi/progetti/mbconsultech-saas`.

## 1. Architettura del Progetto
- **Framework:** Next.js 15 (App Router) con Turbopack, Tailwind CSS v4, React 19.
- **Database e Auth:** Supabase (PostgreSQL). L'autenticazione usa i *Magic Link*.
- **Hosting:** Vercel (Produzione e Preview).
- **Integrazione AI:** Google Gemini (modelli `gemini-2.5-flash` per ragionamento e `text-embedding-004` per vettori).
- **Vector Store:** Supabase con estensione `pgvector` abilitata.
- **MCP Server:** Presente nella cartella `mcp-server/`. È un server locale Model Context Protocol (in TypeScript) che espone strumenti diagnostici per Claude Desktop/AI agent.

## 2. Stato dell'Implementazione
- **UI/UX:** Dashboard creata con tema Scuro (`zinc-950` e accenti `emerald-500`). Pagine di login, creazione progetto, e area riservata (Helpdesk per ticket).
- **Database (Supabase):** Tabelle implementate (prefisso `mbc_` per evitare conflitti con il vecchio Nodoclima):
  - `mbc_profiles`: Profili utenti.
  - `mbc_projects`: Progetti legati agli utenti (tenant-isolated).
  - `mbc_tickets`: Segnalazioni guasti (helpdesk).
  - `mbc_documents`: Metadata dei documenti PDF caricati (bucket `mbc_documents`).
  - `mbc_document_embeddings`: Chunk di testo e vettori a 768 dimensioni (generati da Gemini).
- **RAG Pipeline (`src/app/api/ingest-document/route.ts`):** 
  - L'endpoint estrae testo dai PDF (`pdf-parse` v2), lo divide in frammenti (chunk), usa Gemini per calcolare l'embedding, e lo inserisce nel database tramite il Supabase Service Role (bypass RLS).
- **Ricerca Semantica (`20260729000000_rag_functions.sql`):** 
  - La funzione RPC `match_mbc_document_embeddings` permette di fare query di similarità vettoriale (Cosine Similarity) su uno specifico progetto.

## 3. Server MCP (`mcp-server/`)
Il server TypeScript è già stato compilato ed espone i seguenti tools:
1. `get_ticket_details`: Recupera stato, progetto e cliente per un dato Ticket ID.
2. `query_project_rag`: Riceve in input un `project_id` e una `query`, calcola il vettore con Gemini, usa la funzione RPC Supabase per estrarre i testi pertinenti e restituisce i frammenti documentali.
3. `update_ticket_status`: Aggiorna lo stato di un ticket e salva il `diagnostic_summary` generato dall'AI.

## 4. Variabili d'Ambiente Richieste (`.env.local` / Vercel)
Affinché tutto funzioni a dovere, devono essere configurate le seguenti variabili in Vercel e localmente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Necessaria per l'endpoint di ingestion AI)
- `GEMINI_API_KEY` (Per la generazione vettori e inference AI)

## 5. Prossimi Passi (Next Steps)
1. **Configurazione Iniziale:** 
   - L'utente deve eseguire lo script SQL `supabase/migrations/20260729000000_rag_functions.sql` nel SQL Editor di Supabase per creare la tabella e le funzioni di ricerca RAG.
   - Verificare l'aggiunta di `GEMINI_API_KEY` su Vercel.
2. **Test della Pipeline Documentale:** 
   - Caricare un PDF fittizio (es. un manuale tecnico o P&I) tramite Supabase/Dashboard.
   - Triggerare l'endpoint `POST /api/ingest-document` e assicurarsi che i vettori finiscano in `mbc_document_embeddings`.
3. **Avvio Server MCP:** 
   - Lanciare l'MCP server (con le variabili d'ambiente fornite) e testarlo localmente per rispondere alle diagnostiche o collegarlo a un client MCP come Claude.
4. **Ulteriori Funzionalità UI:** 
   - Manca l'inserimento della P.IVA reale `[Inserire P.IVA]` nel footer di `src/app/page.tsx`.
   - Creare un form in dashboard per permettere agli utenti di caricare fisicamente i documenti dal browser (attualmente c'è l'infrastruttura backend ma manca il frontend di upload documenti per il RAG).

## 6. Istruzioni per l'Assistente AI
Quando ricevi questo file, consideralo la tua "memoria a lungo termine". Sai di trovarti nella macchina dell'utente (`macOS`, path `/Users/mariobortolazzi/progetti/mbconsultech-saas`). 
L'utente chiederà di riprendere i lavori partendo dai "Prossimi Passi" qui sopra. Usa `npm run dev` se ti chiede di testare. Usa i normali tool (CLI, File System) che hai a disposizione nella Sandbox per lavorare sui sorgenti.
