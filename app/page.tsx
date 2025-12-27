import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-8">
            Oportuna
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8">
            Opportunities at Your Doorstep, Filtered by Your Agent
          </p>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Your AI-powered business card that handles inquiries, schedules interviews, 
            and negotiates rates - helping you get discovered for the right opportunities.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
              data-ph-event="signup_click"
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
          Perfect for Early-Career Professionals
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

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">For You</h3>
            <ul className="space-y-4 text-gray-300">
              <li>✓ Create your professional profile and set your preferences</li>
              <li>✓ Define your expertise, availability, and rate expectations</li>
              <li>✓ Let your agent handle initial conversations and scheduling</li>
              <li>✓ Focus on opportunities that match your criteria</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">For Recruiters</h3>
            <ul className="space-y-4 text-gray-300">
              <li>✓ Instant responses to their inquiries</li>
              <li>✓ Pre-qualification based on your criteria</li>
              <li>✓ Easy scheduling for deeper conversations</li>
              <li>✓ Small fee or coffee fund donation for direct contact</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Ready to Let Your Agent Work for You?
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join now and start getting discovered by the right opportunities.
        </p>
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
          data-ph-event="signup_click"
        >
          Create Your Agent
        </Link>
      </section>
    </main>
  );
}

const features = [
  {
    title: 'Smart Filtering',
    description:
      'Your agent pre-qualifies opportunities and handles initial conversations based on your preferences.',
  },
  {
    title: 'Automated Scheduling',
    description:
      'Let your agent handle calendar coordination for interviews and meetings with interested parties.',
  },
  {
    title: 'Value Your Time',
    description:
      'Set a small fee or coffee fund donation for direct contact, ensuring meaningful connections.',
  },
]; 
