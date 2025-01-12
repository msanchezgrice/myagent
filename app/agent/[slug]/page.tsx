'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { generateResponse } from '@/lib/ai';
import { sendPayment } from '@/lib/web3';
import { Agent } from '@/lib/supabase';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AgentChatPage() {
  const params = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      console.log('Fetching agent with slug:', params.slug);
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) {
        console.error('Error fetching agent:', error);
        return;
      }

      console.log('Found agent:', data);
      setAgent(data);
      // Add initial greeting
      const initialMessage = {
        role: 'assistant' as const,
        content: `Hello! I'm ${data.name}. How can I help you today?`,
      };
      console.log('Setting initial message:', initialMessage);
      setMessages([initialMessage]);
    };

    fetchAgent();
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !agent) return;

    const newMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      // Check if payment is required
      if (agent.fee_amount && agent.fee_amount > 0 && messages.length > 2) {
        setPaymentRequired(true);
        return;
      }

      const response = await generateResponse([...messages, newMessage], agent);
      const newAssistantMessage: ChatMessage = { role: 'assistant', content: response };
      
      // Save conversation to Supabase
      const supabase = createBrowserClient();
      console.log('Saving conversation for agent:', agent.id);
      
      const { data: existingConversation } = await supabase
        .from('agent_conversations')
        .select('id, messages')
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('Existing conversation:', existingConversation);

      if (existingConversation && existingConversation.length > 0) {
        // Update existing conversation
        console.log('Updating existing conversation:', existingConversation[0].id);
        const { error: updateError } = await supabase
          .from('agent_conversations')
          .update({
            messages: [...messages, newMessage, newAssistantMessage],
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConversation[0].id);
          
        if (updateError) {
          console.error('Error updating conversation:', updateError);
        }
      } else {
        // Create new conversation
        console.log('Creating new conversation');
        const { error: insertError } = await supabase
          .from('agent_conversations')
          .insert([{
            agent_id: agent.id,
            messages: [...messages, newMessage, newAssistantMessage],
          }]);
          
        if (insertError) {
          console.error('Error creating conversation:', insertError);
        }
      }

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!agent) return;

    try {
      setLoading(true);
      const result = await sendPayment(
        process.env.NEXT_PUBLIC_RECEIVING_ADDRESS!,
        agent.fee_amount!.toString()
      );

      if (result.success) {
        setPaymentRequired(false);
        // Continue the conversation
        const lastMessage = messages[messages.length - 1];
        const response = await generateResponse([...messages], agent);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response },
        ]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'There was an error processing your payment. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
          <p className="text-gray-300">{agent.description}</p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4 h-[60vh] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'assistant' ? 'text-blue-400' : 'text-white'
              }`}
            >
              <strong>{message.role === 'assistant' ? agent.name : 'You'}:</strong>
              <p className="mt-1">{message.content}</p>
            </div>
          ))}
          {loading && (
            <div className="text-gray-400">
              {paymentRequired ? 'Waiting for payment...' : 'Thinking...'}
            </div>
          )}
        </div>

        {paymentRequired ? (
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 mb-4">
            <p className="text-yellow-500 mb-2">
              To continue this conversation, a payment of {agent.fee_amount} ETH is
              required.
            </p>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
            >
              Pay to Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || paymentRequired}
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={loading || paymentRequired}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 