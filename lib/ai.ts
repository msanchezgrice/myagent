import OpenAI from 'openai';
import { Agent } from './supabase';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function getOpenAIClient() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key is missing. Please check your environment variables.');
    throw new Error('OpenAI API key is not configured');
  }

  // Log the first few characters of the API key for debugging (in development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('OpenAI API key starts with:', apiKey.substring(0, 4) + '...');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
}

export async function generateResponse(messages: Message[], agent: Agent): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    // Create the system message that defines the agent's personality
    const systemPrompt = agent.prompt || `You are an AI agent named ${agent.name}. ${
      agent.personality ? `Your personality is ${agent.personality}.` : ''
    } ${
      agent.interests?.length
        ? `Your interests include: ${agent.interests.join(', ')}.`
        : ''
    } ${
      agent.facts?.length
        ? `Key facts about you: ${agent.facts.join(', ')}.`
        : ''
    }
    
    ${agent.description || ''}
    
    You are a professional business card that helps handle inquiries, schedule interviews, and negotiate rates.
    Your goal is to help your owner get discovered for relevant opportunities while respecting their preferences and requirements.
    Keep your responses concise, professional, and focused on facilitating meaningful connections.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
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

    if (!response.choices[0]?.message?.content) {
      console.error('OpenAI response was empty:', response);
      return 'I apologize, but I was unable to generate a response.';
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateResponse:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is not properly configured. Please check your environment variables.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while generating the response.');
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