import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error("Missing required environment variables (SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

class MBConsultechServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mbconsultech-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_ticket_details",
          description: "Recupera i dettagli di un ticket diagnostico aperto, inclusi lo stato e la descrizione.",
          inputSchema: {
            type: "object",
            properties: {
              ticket_id: { type: "string", description: "L'UUID del ticket" },
            },
            required: ["ticket_id"],
          },
        },
        {
          name: "query_project_rag",
          description: "Interroga la documentazione di un progetto (P&I, specifiche) usando ricerca semantica RAG (Retrieval-Augmented Generation). Restituisce i frammenti di testo pertinenti.",
          inputSchema: {
            type: "object",
            properties: {
              project_id: { type: "string", description: "L'UUID del progetto" },
              query: { type: "string", description: "La domanda tecnica da fare sui documenti" },
            },
            required: ["project_id", "query"],
          },
        },
        {
          name: "update_ticket_status",
          description: "Aggiorna lo stato o il sommario diagnostico di un ticket.",
          inputSchema: {
            type: "object",
            properties: {
              ticket_id: { type: "string", description: "L'UUID del ticket" },
              status: { type: "string", enum: ["open", "in_progress", "resolved", "closed"], description: "Nuovo stato del ticket" },
              diagnostic_summary: { type: "string", description: "Report o sommario della diagnostica effettuata" },
            },
            required: ["ticket_id"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "get_ticket_details": {
          const { ticket_id } = request.params.arguments as any;
          
          const { data, error } = await supabase
            .from("mbc_tickets")
            .select("*, mbc_projects(name, client_id)")
            .eq("id", ticket_id)
            .single();

          if (error) {
            throw new McpError(ErrorCode.InternalError, `Errore Supabase: ${error.message}`);
          }

          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "query_project_rag": {
          const { project_id, query } = request.params.arguments as any;

          try {
            // 1. Generate embedding for query
            const response = await ai.models.embedContent({
              model: 'text-embedding-004',
              contents: query,
            });
            
            const embedding = response.embeddings?.[0]?.values;
            if (!embedding) {
              throw new Error("Impossibile generare i vettori con Gemini.");
            }

            // 2. Search Supabase via RPC
            const { data, error } = await supabase.rpc("match_mbc_document_embeddings", {
              query_embedding: `[${embedding.join(',')}]`,
              match_threshold: 0.5,
              match_count: 5,
              filter_project_id: project_id
            });

            if (error) {
              throw new Error(`Errore RPC Supabase: ${error.message}`);
            }

            return {
              content: [
                { 
                  type: "text", 
                  text: data && data.length > 0 
                    ? data.map((d: any) => `Document ID: ${d.document_id}\nSimilarity: ${d.similarity}\nContent: ${d.content_chunk}`).join("\n\n---\n\n")
                    : "Nessun risultato rilevante trovato nei documenti di questo progetto."
                }
              ],
            };
          } catch (err: any) {
             throw new McpError(ErrorCode.InternalError, `Errore RAG: ${err.message}`);
          }
        }

        case "update_ticket_status": {
          const { ticket_id, status, diagnostic_summary } = request.params.arguments as any;
          
          const updates: any = {};
          if (status) updates.status = status;
          if (diagnostic_summary) updates.diagnostic_summary = diagnostic_summary;

          const { data, error } = await supabase
            .from("mbc_tickets")
            .update(updates)
            .eq("id", ticket_id)
            .select()
            .single();

          if (error) {
            throw new McpError(ErrorCode.InternalError, `Errore Supabase: ${error.message}`);
          }

          return {
            content: [{ type: "text", text: `Ticket ${ticket_id} aggiornato con successo:\n${JSON.stringify(data, null, 2)}` }],
          };
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Tool non trovato: ${request.params.name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MB Consultech MCP Server running on stdio");
  }
}

const server = new MBConsultechServer();
server.run().catch(console.error);
