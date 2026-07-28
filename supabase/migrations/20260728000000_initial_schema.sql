-- Estensione per RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabella Utenti (Estende auth.users di Supabase)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT NOT NULL,
    role TEXT DEFAULT 'client', -- 'admin' o 'client'
    stripe_customer_id TEXT
);

-- Configurazione RLS per profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tabella Progetti
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurazione RLS per projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own projects" ON public.projects FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Admins manage all projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tabella Ticket / Richieste Asincrone
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
    diagnostic_summary TEXT, -- Generato dall'IA / Consulente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurazione RLS per tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own project tickets" ON public.tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = public.tickets.project_id AND client_id = auth.uid())
);
CREATE POLICY "Clients can create tickets" ON public.tickets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE id = public.tickets.project_id AND client_id = auth.uid())
);
CREATE POLICY "Admins manage all tickets" ON public.tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tabella Documenti (File caricati: P&I, Schemi, Log)
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    content_text TEXT, -- Testo estratto per RAG
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own documents" ON public.documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = public.documents.project_id AND client_id = auth.uid())
);
CREATE POLICY "Admins manage all documents" ON public.documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tabella Embedding per il RAG
CREATE TABLE public.document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    content_chunk TEXT NOT NULL,
    embedding vector(1536) -- Modello OpenAI text-embedding-3-small
);

ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
-- Gli embedding sono di solito accessibili solo tramite API backend protette (es. MCP),
-- ma possiamo dare accesso in lettura all'admin.
CREATE POLICY "Admins view all embeddings" ON public.document_embeddings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Funzione di Ricerca Vettoriale RAG (Matching)
CREATE OR REPLACE FUNCTION match_document_embeddings (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_project_id uuid
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  content_chunk text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_embeddings.id,
    document_embeddings.document_id,
    document_embeddings.content_chunk,
    1 - (document_embeddings.embedding <=> query_embedding) AS similarity
  FROM document_embeddings
  WHERE 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
    AND project_id = p_project_id
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
