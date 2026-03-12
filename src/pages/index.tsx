import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { MessageCircle, Shield, TrendingUp, Heart, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { BuddyAvatar } from "@/components/ui";

interface LandingPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const features = [
  {
    icon: MessageCircle,
    title: "Confidential Conversations",
    description: "Chat privately with Buddy about work stress, challenges, or just your day. Everything stays between you and Buddy.",
  },
  {
    icon: Heart,
    title: "Emotional Support",
    description: "Get empathetic responses that help you process your feelings and find balance in your work life.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Wellbeing",
    description: "Understand patterns in your emotions over time and get insights to improve your workplace experience.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your conversations are private. We use industry-standard security to protect your data.",
  },
];

export default function LandingPage({ darkMode, onToggleDarkMode }: LandingPageProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/chat");
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Buddy — Your Supportive Workplace Companion</title>
        <meta name="description" content="Buddy is an AI companion that helps employees manage workplace stress and improve wellbeing through confidential conversations." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BuddyAvatar size="sm" />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Buddy</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-16">
          <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Supporting workplace wellbeing
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                Your supportive workplace companion
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Buddy is an AI companion that helps you navigate workplace stress, process your emotions, and improve your overall wellbeing — all through friendly, confidential conversations.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20"
                >
                  Start Chatting
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>

            <div className="mt-16 md:mt-24 relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 md:p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4 mb-4">
                  <BuddyAvatar size="md" />
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-2xl rounded-tl-md px-4 py-3">
                    <p className="text-slate-700 dark:text-slate-200">
                      Hey there! 👋 I&apos;m Buddy. How are you feeling today? I&apos;m here to listen and help however I can.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 justify-end">
                  <div className="bg-indigo-500 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p>It&apos;s been a stressful week with all the deadlines...</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Why employees love Buddy
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                  A safe space to share your thoughts and get support when you need it most
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to feel supported?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of employees who have found a better way to manage workplace stress
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </main>

        <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BuddyAvatar size="sm" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Buddy</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} Buddy. Supporting workplace wellbeing.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
