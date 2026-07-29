-- Change vector size from 1536 (OpenAI) to 768 (Gemini text-embedding-004)
ALTER TABLE public.mbc_document_embeddings DROP COLUMN embedding;
ALTER TABLE public.mbc_document_embeddings ADD COLUMN embedding vector(768);

-- Create a function for similarity search
CREATE OR REPLACE FUNCTION match_mbc_document_embeddings (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_project_id uuid
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
    mbc_document_embeddings.id,
    mbc_document_embeddings.document_id,
    mbc_document_embeddings.content_chunk,
    1 - (mbc_document_embeddings.embedding <=> query_embedding) AS similarity
  FROM mbc_document_embeddings
  WHERE mbc_document_embeddings.project_id = filter_project_id
  AND 1 - (mbc_document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY mbc_document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
