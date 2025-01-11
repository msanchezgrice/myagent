import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

export type Agent = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  description?: string;
  personality?: string;
  interests?: string[];
  facts?: string[];
  prompt?: string;
  fee_amount?: number;
  fee_token?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AgentConversation = {
  id: string;
  agent_id: string;
  visitor_id: string | null;
  messages: any[];
  metadata: any;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  agent_id: string;
  conversation_id: string | null;
  from_address: string;
  amount: number;
  token: string;
  tx_hash: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};

// Create a Supabase client for use in the browser
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
}; 