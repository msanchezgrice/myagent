-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    personality TEXT,
    interests TEXT[],
    facts TEXT[],
    prompt TEXT,
    fee_amount DECIMAL(18,8),
    fee_token TEXT DEFAULT 'ETH',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent visits table
CREATE TABLE agent_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent conversations table
CREATE TABLE agent_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    visitor_id UUID,
    messages JSONB NOT NULL DEFAULT '[]',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES agent_conversations(id),
    from_address TEXT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    token TEXT DEFAULT 'ETH',
    tx_hash TEXT UNIQUE NOT NULL,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_slug ON agents(slug);
CREATE INDEX idx_agent_visits_agent_id ON agent_visits(agent_id);
CREATE INDEX idx_agent_conversations_agent_id ON agent_conversations(agent_id);
CREATE INDEX idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Similar policies for other tables...

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to track agent visits
CREATE OR REPLACE FUNCTION track_agent_visit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO agent_visits (agent_id, visitor_ip, user_agent, referrer)
  VALUES (
    NEW.agent_id,
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent',
    current_setting('request.headers')::json->>'referer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to track visits on new conversations
CREATE OR REPLACE TRIGGER on_conversation_created
  AFTER INSERT ON agent_conversations
  FOR EACH ROW
  EXECUTE FUNCTION track_agent_visit();

-- Enable RLS
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

-- Policy for inserting conversations (anyone can create)
CREATE POLICY "Anyone can create conversations"
ON agent_conversations FOR INSERT
TO public
WITH CHECK (true);

-- Policy for viewing conversations (agent owners can view)
CREATE POLICY "Agent owners can view conversations"
ON agent_conversations FOR SELECT
TO public
USING (
  agent_id IN (
    SELECT id FROM agents
    WHERE user_id = auth.uid()
  )
);

-- Policy for updating conversations (agent owners can update)
CREATE POLICY "Agent owners can update conversations"
ON agent_conversations FOR UPDATE
TO public
USING (
  agent_id IN (
    SELECT id FROM agents
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  agent_id IN (
    SELECT id FROM agents
    WHERE user_id = auth.uid()
  )
); 