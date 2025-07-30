'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-card-bg text-foreground rounded-b-3xl shadow-2xl border-b border-card-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-xl text-primary">
                Master DSA with <span className="text-accent animate-pulse">AI-Powered</span> Learning
              </h1>
              <p className="text-2xl text-muted font-medium">
                CodeArena helps you practice Data Structures & Algorithms with real-time AI assistance, competitive duels, and mock interviews.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {user ? (
                  <Link href="/problems" className="btn btn-primary">
                    Start Practicing
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="btn btn-primary">
                      Sign Up Free
                    </Link>
                    <Link href="/login" className="btn btn-secondary">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-card-bg rounded-2xl p-6 shadow-card-shadow border border-card-border">
                <pre className="text-success font-mono text-base md:text-lg overflow-x-auto animate-fade-in">
                  <code>{`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-primary drop-shadow-lg">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🤖" 
              title="AI Copilot" 
              description="Get real-time assistance with hints, explanations, and code optimization suggestions from our AI assistant."
            />
            <FeatureCard 
              icon="⚖️" 
              title="DSA Duels" 
              description="Challenge your friends or random opponents to coding duels and improve your problem-solving skills."
            />
            <FeatureCard 
              icon="🎯" 
              title="Mock Interviews" 
              description="Practice technical interviews with our AI interviewer and get feedback on your performance."
            />
            <FeatureCard 
              icon="🔍" 
              title="8+ Languages" 
              description="Code in your preferred language with support for Python, JavaScript, Java, C++, and more."
            />
            <FeatureCard 
              icon="📊" 
              title="Progress Tracking" 
              description="Track your progress, identify weak areas, and get personalized recommendations."
            />
            <FeatureCard 
              icon="🔐" 
              title="Secure Platform" 
              description="Built with JWT authentication, bcrypt password hashing, and robust validation."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-card-bg text-foreground text-center rounded-t-3xl shadow-2xl border-t border-card-border mt-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-extrabold text-primary">Ready to level up your DSA skills?</h2>
          <p className="text-2xl text-muted">Join thousands of students preparing for technical interviews with CodeArena.</p>
          {user ? (
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/problems" className="btn btn-primary">
                Practice Problems
              </Link>
              <Link href="/duels" className="btn btn-secondary">
                Join a Duel
              </Link>
            </div>
          ) : (
            <Link href="/register" className="btn btn-primary text-xl">
              Get Started Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card p-8">
      <div className="text-5xl mb-4 animate-bounce-slow">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-primary">{title}</h3>
      <p className="text-muted text-lg">{description}</p>
    </div>
  );
}