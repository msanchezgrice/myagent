import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Meet Your Personal AI Agent
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Create, customize, and monetize your own AI agent. Set your preferences,
            define its personality, and let it work for you.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24 bg-gray-900/50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Ready to Create Your Agent?
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join now and start building your personalized AI agent in minutes.
        </p>
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
        >
          Create Your Agent
        </Link>
      </section>
    </main>
  );
}

const features = [
  {
    title: 'Customizable Personality',
    description:
      'Define your agent\'s tone, interests, and behavior to match your preferences.',
  },
  {
    title: 'Monetization',
    description:
      'Set custom rates and earn cryptocurrency through your agent\'s interactions.',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Track your agent\'s performance, engagement, and earnings in real-time.',
  },
]; 