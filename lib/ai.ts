import OpenAI from 'openai';
import { Agent } from './supabase';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function generateResponse(messages: Message[], agent: Agent): Promise<string> {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('No AI provider configured. Please set up OpenAI.');
  }

  // Create the system message that defines the agent's personality
  const systemPrompt = `You are an AI agent named ${agent.name}. ${
    agent.personality ? `Your personality is ${agent.personality}.` : ''
  } ${
    agent.interests?.length
      ? `Your interests include: ${agent.interests.join(', ')}.`
      : ''
  }
  
  ${agent.description || ''}
  
  Please respond to the user's messages in a way that reflects your personality and interests.
  Keep your responses concise and engaging.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function shouldRequestPayment(
  messages: Message[],
  agentSettings: Partial<Agent>
): Promise<boolean> {
  // Simple logic: if fee amount is set and conversation length > 2 messages
  if (agentSettings.fee_amount && agentSettings.fee_amount > 0 && messages.length > 2) {
    return true;
  }
  return false;
} 