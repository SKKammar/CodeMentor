// =============================================
// CodeMentor v2 — Type Definitions
// =============================================

/** The three AI interaction modes */
export type Mode = "socratic" | "explain" | "review";

/** A single message in the conversation */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/** A coding session record stored in Supabase */
export interface Session {
  id?: string;
  user_id?: string;
  language: string;
  problem_description: string;
  mode: Mode;
  hint_count: number;
  solved_independently: boolean;
  concepts: string[];
  created_at?: string;
}

/** A concept node in the knowledge graph */
export interface ConceptNode {
  id?: string;
  user_id?: string;
  concept: string;
  exposure_count: number;
  connected_concepts: string[];
  updated_at?: string;
}

/** Dashboard aggregated statistics */
export interface DashboardStats {
  total_attempted: number;
  total_solved: number;
  solve_rate: number;
  current_streak: number;
  longest_streak: number;
  languages: { language: string; count: number }[];
  hint_scores: { date: string; avg_hints: number }[];
  recent_sessions: Session[];
}

/** ReactFlow node data for the concept graph */
export interface GraphNodeData {
  concept: string;
  exposure_count: number;
}

/** Shape of the /api/chat request body */
export interface ChatRequestBody {
  messages: ChatMessage[];
  mode: Mode;
  code?: string;
}

/** Shape of the /api/chat SSE event */
export interface ChatStreamEvent {
  type: "token" | "done" | "error";
  data?: string;
}
