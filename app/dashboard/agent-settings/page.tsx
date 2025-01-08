'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { Agent } from '@/lib/supabase';

function AgentSettingsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get('id');

  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    slug: '',
    description: '',
    personality: '',
    interests: [],
    fee_amount: 0,
    fee_token: 'ETH',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      if (!agentId) return;

      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) {
        console.error('Error fetching agent:', error);
        return;
      }

      if (data) {
        setFormData(data);
      }
    };

    fetchAgent();
  }, [agentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create an agent');
      }

      // Convert interests from string to array if needed
      const interests = typeof formData.interests === 'string' 
        ? (formData.interests as string).split(',').map((i: string) => i.trim())
        : formData.interests || [];

      const data = {
        ...formData,
        user_id: user.id,
        interests,
        fee_amount: Number(formData.fee_amount || 0),
      };

      if (agentId) {
        // Update existing agent
        const { error } = await supabase
          .from('agents')
          .update(data)
          .eq('id', agentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new agent
        const { error } = await supabase.from('agents').insert([data]);
        if (error) throw error;
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {agentId ? 'Edit Agent' : 'Create New Agent'}
          </h1>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Slug (URL-friendly name)
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Personality</label>
              <input
                type="text"
                value={formData.personality || ''}
                onChange={(e) =>
                  setFormData({ ...formData, personality: e.target.value })
                }
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., friendly, professional, humorous"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Interests (comma-separated)
              </label>
              <input
                type="text"
                value={
                  Array.isArray(formData.interests)
                    ? formData.interests.join(', ')
                    : formData.interests || ''
                }
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value.split(',').map(i => i.trim()) })
                }
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., technology, science, art"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fee Amount</label>
                <input
                  type="number"
                  value={formData.fee_amount || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fee_amount: parseFloat(e.target.value),
                    })
                  }
                  step="0.0001"
                  min="0"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fee Token</label>
                <select
                  value={formData.fee_token || 'ETH'}
                  onChange={(e) =>
                    setFormData({ ...formData, fee_token: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ETH">ETH</option>
                  {/* Add more tokens as needed */}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label className="ml-2 block text-sm">Active</label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading
                  ? 'Saving...'
                  : agentId
                  ? 'Update Agent'
                  : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AgentSettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <AgentSettingsForm />
    </Suspense>
  );
} 