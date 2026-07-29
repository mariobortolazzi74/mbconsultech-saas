"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const supabase_js_1 = require("@supabase/supabase-js");
const genai_1 = require("@google/genai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error("Missing required environment variables (SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY)");
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
class MBConsultechServer {
    server;
    constructor() {
        this.server = new index_js_1.Server({
            name: "mbconsultech-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = (error) => console.error("[MCP Error]", error);
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
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
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case "get_ticket_details": {
                    const { ticket_id } = request.params.arguments;
                    const { data, error } = await supabase
                        .from("mbc_tickets")
                        .select("*, mbc_projects(name, client_id)")
                        .eq("id", ticket_id)
                        .single();
                    if (error) {
                        throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Errore Supabase: ${error.message}`);
                    }
                    return {
                        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
                    };
                }
                case "query_project_rag": {
                    const { project_id, query } = request.params.arguments;
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
                                        ? data.map((d) => `Document ID: ${d.document_id}\nSimilarity: ${d.similarity}\nContent: ${d.content_chunk}`).join("\n\n---\n\n")
                                        : "Nessun risultato rilevante trovato nei documenti di questo progetto."
                                }
                            ],
                        };
                    }
                    catch (err) {
                        throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Errore RAG: ${err.message}`);
                    }
                }
                case "update_ticket_status": {
                    const { ticket_id, status, diagnostic_summary } = request.params.arguments;
                    const updates = {};
                    if (status)
                        updates.status = status;
                    if (diagnostic_summary)
                        updates.diagnostic_summary = diagnostic_summary;
                    const { data, error } = await supabase
                        .from("mbc_tickets")
                        .update(updates)
                        .eq("id", ticket_id)
                        .select()
                        .single();
                    if (error) {
                        throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Errore Supabase: ${error.message}`);
                    }
                    return {
                        content: [{ type: "text", text: `Ticket ${ticket_id} aggiornato con successo:\n${JSON.stringify(data, null, 2)}` }],
                    };
                }
                default:
                    throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Tool non trovato: ${request.params.name}`);
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error("MB Consultech MCP Server running on stdio");
    }
}
const server = new MBConsultechServer();
server.run().catch(console.error);
