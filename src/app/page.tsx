// ========================================
// OgbiaLearn - Marketing Landing Page
// ========================================

import Link from "next/link";
import {
  BookOpen,
  Headphones,
  Trophy,
  Heart,
  Zap,
  Globe,
} from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl border-2 p-6 ${color} hover:shadow-md transition-shadow`}
    >
      <div className="mb-4">{icon}</div>
      <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-green-500 to-emerald-600">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">O</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              OgbiaLearn
            </h1>
          </div>
          <Link
            href="/learn"
            className="bg-white text-green-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors"
          >
            Get Started
          </Link>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Globe size={16} />
            Preserving the Ogbia Language
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Learn Ogbia
            <br />
            <span className="text-green-200">the fun way.</span>
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10">
            Master the Ogbia language with interactive lessons, audio
            pronunciation, and gamified challenges. Earn XP, maintain streaks,
            and unlock new content!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="bg-white text-green-600 px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-green-50 transition-colors shadow-lg border-b-4 border-green-200 active:border-b-0"
            >
              Start Learning — It&apos;s Free
            </Link>
            <Link
              href="/courses"
              className="bg-green-400/30 text-white px-10 py-4 rounded-2xl font-extrabold text-lg hover:bg-green-400/40 transition-colors border-2 border-white/20"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-extrabold text-center text-slate-800 mb-4">
            Why OgbiaLearn?
          </h3>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
            A Duolingo-style experience built specifically for the Ogbia
            language
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="text-green-500" size={32} />}
              title="Interactive Lessons"
              description="Multiple choice, translation, and listening challenges that adapt to your learning style."
              color="bg-green-50 border-green-200"
            />
            <FeatureCard
              icon={<Headphones className="text-sky-500" size={32} />}
              title="Native Audio"
              description="Hear every word pronounced correctly. Learn pronunciation from day one."
              color="bg-sky-50 border-sky-200"
            />
            <FeatureCard
              icon={<Trophy className="text-amber-500" size={32} />}
              title="Gamified Learning"
              description="Earn XP, maintain streaks, and compete on leaderboards. Learning has never been this fun."
              color="bg-amber-50 border-amber-200"
            />
            <FeatureCard
              icon={<Heart className="text-rose-500" size={32} />}
              title="Hearts System"
              description="Hearts keep you motivated. Make mistakes and learn from them with our AI tutor."
              color="bg-rose-50 border-rose-200"
            />
            <FeatureCard
              icon={<Zap className="text-purple-500" size={32} />}
              title="AI Tutor"
              description="Get contextual explanations powered by AI when you make mistakes."
              color="bg-purple-50 border-purple-200"
            />
            <FeatureCard
              icon={<Globe className="text-teal-500" size={32} />}
              title="Cultural Context"
              description="Learn not just words, but the culture behind them. Every lesson includes cultural insights."
              color="bg-teal-50 border-teal-200"
            />
          </div>
        </div>
      </section>

      {/* Word Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-extrabold text-slate-800 mb-4">
            Start with Basics
          </h3>
          <p className="text-slate-500 mb-10">
            Here are some words you&apos;ll learn in your first lessons
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { en: "Head", og: "Emù" },
              { en: "Eye", og: "Adien" },
              { en: "Hand", og: "Aguo" },
              { en: "Ear", og: "Ato" },
              { en: "Pot", og: "O'gbèlè" },
              { en: "Bed", og: "Agbàdà" },
              { en: "Knife", og: "O'gya" },
              { en: "Spoon", og: "Ìngìasì" },
            ].map((word) => (
              <div
                key={word.en}
                className="rounded-2xl border-2 border-slate-200 p-4 hover:border-green-400 hover:shadow-md transition-all cursor-default"
              >
                <p className="text-sm text-slate-400 mb-1">{word.en}</p>
                <p className="text-lg font-bold text-green-600">{word.og}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-green-500">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-extrabold text-white mb-4">
            Ready to learn Ogbia?
          </h3>
          <p className="text-green-100 text-lg mb-8">
            Join the effort to preserve and spread the Ogbia language.
          </p>
          <Link
            href="/learn"
            className="inline-block bg-white text-green-600 px-12 py-4 rounded-2xl font-extrabold text-lg hover:bg-green-50 transition-colors shadow-lg border-b-4 border-green-200 active:border-b-0"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} OgbiaLearn. Built with love for the
          Ogbia community.
        </p>
      </footer>
    </div>
  );
}
