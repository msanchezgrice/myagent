# My Agent

A platform for creating and customizing AI agents with crypto payment integration.

## Features

### Phase 1
- Landing page with project overview
- User authentication with Supabase
- Basic agent chat interface
- Agent customization (personality, interests)

### Phase 2
- Crypto payment integration with MetaMask
- User preference settings
- Bid-based conversation system

### Phase 3
- Analytics dashboard
- Conversation logs
- UI polish and optimizations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Anthropic/OpenAI
- **Blockchain**: ethers.js, RainbowKit
- **Analytics**: Custom implementation with Supabase

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic or OpenAI API key
- MetaMask wallet (for testing payments)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables in `.env.local`

4. **Supabase Setup**
   1. Create a new project in Supabase
   2. Go to Project Settings > Database to find your connection details
   3. Copy the SQL from `supabase/schema.sql` and run it in the Supabase SQL editor
   4. Enable Email Auth in Authentication > Providers
   5. Update your `.env.local` with Supabase credentials

5. **Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Create a new project in Vercel
3. Connect your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Environment Variables on Vercel
Make sure to add all environment variables from `.env.local` to your Vercel project settings.

## Project Structure

```
my-agent/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-related pages
│   ├── agent/             # Agent-related pages
│   ├── dashboard/         # Dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── ai.ts             # AI model integration
│   └── web3.ts           # Blockchain integration
├── public/               # Static assets
└── supabase/            # Supabase configurations
    └── schema.sql       # Database schema
```

## Development Workflow

1. **Local Development**
   - Run `npm run dev` for development
   - Make changes and test locally
   - Commit changes with meaningful messages

2. **Testing**
   - Test authentication flows
   - Test agent interactions
   - Test payment integration with test networks
   - Verify analytics tracking

3. **Deployment**
   - Push changes to main branch
   - Vercel will automatically deploy
   - Verify deployment in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 