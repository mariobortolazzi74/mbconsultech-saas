import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { PDFParse } from 'pdf-parse';

// Initialize Supabase Admin Client to bypass RLS for inserting embeddings
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simple text splitter function
function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.slice(i, end));
    i += chunkSize - overlap;
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { documentId, projectId, storagePath } = await req.json();

    if (!documentId || !projectId || !storagePath) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Starting ingestion for document ${documentId}`);

    // 1. Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('mbc_documents')
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      return NextResponse.json({ error: 'Failed to download file from storage' }, { status: 500 });
    }

    // 2. Parse the PDF
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let text = '';
    try {
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      text = pdfData.text;
      await parser.destroy();
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }

    // Clean up text slightly
    text = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

    if (!text) {
      return NextResponse.json({ error: 'No text found in PDF' }, { status: 400 });
    }

    // 3. Chunk the text
    const chunks = splitTextIntoChunks(text, 1000, 200);
    console.log(`Split document into ${chunks.length} chunks`);

    // 4. Generate embeddings and insert into database
    let insertedCount = 0;
    
    // Process in small batches to avoid hitting API limits
    for (const chunk of chunks) {
      try {
        const response = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: chunk,
        });

        const embedding = response.embeddings?.[0]?.values;
        
        if (embedding) {
          // Format embedding as string '[0.1, 0.2, ...]' for pgvector
          const embeddingString = `[${embedding.join(',')}]`;
          
          const { error: insertError } = await supabaseAdmin
            .from('mbc_document_embeddings')
            .insert({
              document_id: documentId,
              project_id: projectId,
              content_chunk: chunk,
              embedding: embeddingString
            });

          if (insertError) {
            console.error('Error inserting chunk:', insertError);
          } else {
            insertedCount++;
          }
        }
      } catch (embedError) {
        console.error('Error generating embedding for chunk:', embedError);
      }
    }

    // Update document with the full extracted text for reference
    await supabaseAdmin
      .from('mbc_documents')
      .update({ content_text: text.substring(0, 50000) }) 
      .eq('id', documentId);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully ingested document`,
      chunksTotal: chunks.length,
      chunksInserted: insertedCount
    });
    
  } catch (error: any) {
    console.error('Unhandled ingestion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
