'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import { Agent, AgentConversation, Transaction } from '@/lib/supabase';

type DashboardStats = {
  totalVisits: number;
  totalConversations: number;
  totalEarnings: number;
  conversionRate: number;
};

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVisits: 0,
    totalConversations: 0,
    totalEarnings: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createBrowserClient();

      try {
        // Fetch user's agents
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .order('created_at', { ascending: false });

        if (agentsError) throw agentsError;

        // Fetch analytics data for all agents
        const agentIds = agentsData?.map((agent) => agent.id) || [];
        
        const [visitsCount, conversationsCount, transactionsSum] = await Promise.all([
          supabase
            .from('agent_visits')
            .select('*', { count: 'exact' })
            .in('agent_id', agentIds),
          supabase
            .from('agent_conversations')
            .select('*', { count: 'exact' })
            .in('agent_id', agentIds),
          supabase
            .from('transactions')
            .select('amount')
            .in('agent_id', agentIds)
            .eq('status', 'completed')
        ]);

        // Calculate stats
        const totalVisits = visitsCount.count || 0;
        const totalConversations = conversationsCount.count || 0;
        const totalEarnings = transactionsSum.data?.reduce(
          (sum, tx) => sum + (tx.amount || 0),
          0
        ) || 0;

        setAgents(agentsData || []);
        setStats({
          totalVisits,
          totalConversations,
          totalEarnings,
          conversionRate:
            totalVisits > 0
              ? (totalConversations / totalVisits) * 100
              : 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/dashboard/agent-settings"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Create New Agent
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Visits</h3>
            <p className="text-3xl font-bold">{stats.totalVisits}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Conversations</h3>
            <p className="text-3xl font-bold">{stats.totalConversations}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold">{stats.totalEarnings.toFixed(4)} ETH</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Your Agents</h2>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                    <p className="text-gray-400">{agent.description}</p>
                    <div className="mt-2 space-x-2">
                      <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                        Fee: {agent.fee_amount} {agent.fee_token}
                      </span>
                      <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                        Status: {agent.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <div className="flex space-x-4">
                      <Link
                        href={`/agent/${agent.slug}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/agent-settings?id=${agent.id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/history/${agent.id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        History
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-gray-400">
                You haven't created any agents yet. Create your first agent to get
                started!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 