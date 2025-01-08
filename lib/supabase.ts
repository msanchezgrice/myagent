import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

// For server-side operations
export const supabase = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// For client-side operations
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
};

// Types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Agent = Database['public']['Tables']['agents']['Row'];
export type AgentConversation = Database['public']['Tables']['agent_conversations']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row']; 