export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          user_id: string
          slug: string
          name: string
          description: string | null
          personality: string | null
          interests: string[] | null
          fee_amount: number | null
          fee_token: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          name: string
          description?: string | null
          personality?: string | null
          interests?: string[] | null
          fee_amount?: number | null
          fee_token?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          name?: string
          description?: string | null
          personality?: string | null
          interests?: string[] | null
          fee_amount?: number | null
          fee_token?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      agent_visits: {
        Row: {
          id: string
          agent_id: string
          visitor_ip: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          visitor_ip?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          visitor_ip?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
      agent_conversations: {
        Row: {
          id: string
          agent_id: string
          visitor_id: string | null
          messages: Json
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          visitor_id?: string | null
          messages?: Json
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          visitor_id?: string | null
          messages?: Json
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          agent_id: string
          conversation_id: string | null
          from_address: string
          amount: number
          token: string
          tx_hash: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          conversation_id?: string | null
          from_address: string
          amount: number
          token?: string
          tx_hash: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          conversation_id?: string | null
          from_address?: string
          amount?: number
          token?: string
          tx_hash?: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin'
      transaction_status: 'pending' | 'completed' | 'failed'
    }
  }
}
