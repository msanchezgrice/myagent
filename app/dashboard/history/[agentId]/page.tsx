'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { Agent, AgentConversation } from '@/lib/supabase';

export default function AgentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log('Starting history fetch...');
      console.log('Current params:', params);
      const supabase = createBrowserClient();
      console.log('Fetching history for agent:', params.agentId);

      try {
        // Fetch agent details
        console.log('Fetching agent details...');
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('id', params.agentId)
          .single();

        if (agentError) {
          console.error('Error fetching agent:', agentError);
          throw agentError;
        }
        console.log('Agent data:', agentData);
        setAgent(agentData);

        // Fetch conversations
        console.log('Fetching conversations...');
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('agent_conversations')
          .select('*')
          .eq('agent_id', params.agentId)
          .order('created_at', { ascending: false });

        if (conversationsError) {
          console.error('Error fetching conversations:', conversationsError);
          throw conversationsError;
        }
        console.log('Conversations data:', conversationsData);
        console.log('Number of conversations found:', conversationsData?.length || 0);
        setConversations(conversationsData || []);
      } catch (error) {
        console.error('Error in fetchHistory:', error);
      } finally {
        console.log('Fetch history completed');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [params.agentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Conversation History - {agent?.name}
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-6">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-gray-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400">
                    {new Date(conversation.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {conversation.id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Array.isArray(conversation.messages) && conversation.messages.map((message: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded ${
                      message.role === 'assistant'
                        ? 'bg-blue-900/20 ml-4'
                        : 'bg-gray-700/20 mr-4'
                    }`}
                  >
                    <p className="text-sm text-gray-400 mb-1">
                      {message.role === 'assistant' ? agent?.name : 'Visitor'}
                    </p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {conversations.length === 0 && (
            <p className="text-gray-400 text-center">
              No conversations found for this agent.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 