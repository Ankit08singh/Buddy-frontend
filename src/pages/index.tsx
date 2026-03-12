import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { MessageCircle, Shield, TrendingUp, Heart, ArrowRight, Sun, Moon, Sparkles, Zap, ShieldCheck, Smile } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { BuddyAvatar, Avatar } from "@/components/ui";

interface LandingPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const features = [
  {
    icon: MessageCircle,
    title: "Confidential Conversations",
    description: "Chat privately with Buddy about work stress, challenges, or just your day. Your privacy is our priority.",
    color: "emerald"
  },
  {
    icon: Heart,
    title: "Emotional Support",
    description: "Get empathetic, human-like responses that help you process feelings and find workplace balance.",
    color: "amber"
  },
  {
    icon: TrendingUp,
    title: "Wellbeing Analytics",
    description: "Understand emotional patterns over time with intuitive insights designed for growth.",
    color: "primary"
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "Industry-standard encryption ensures your conversations stay private and secure.",
    color: "slate"
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
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center animate-pulse shadow-xl shadow-primary/20">
            <span className="text-(--primary-foreground) text-lg font-serif">B</span>
          </div>
          <span className="text-sm font-medium text-(--muted-foreground) animate-pulse">Initializing Buddy...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground) selection:bg-primary selection:text-white overflow-hidden">
      <Head>
        <title>Buddy — Your Empathic Workplace Companion</title>
        <meta name="description" content="Buddy is an AI companion that helps employees manage workplace stress and improve wellbeing through confidential conversations." />
      </Head>

      {/* Hero Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/10 transition-transform hover:rotate-3">
              <span className="text-white text-xl font-serif">B</span>
            </div>
            <span className="text-xl font-black tracking-tight text-(--foreground)">Buddy</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-bold text-(--muted-foreground) hover:text-primary transition-colors">Features</Link>
            <Link href="#about" className="text-sm font-bold text-(--muted-foreground) hover:text-primary transition-colors">About</Link>
            <Link href="#security" className="text-sm font-bold text-(--muted-foreground) hover:text-primary transition-colors">Security</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl bg-(--secondary) text-(--muted-foreground) hover:text-primary transition-all active:scale-95 border border-(--border)"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              href="/auth/login"
              className="hidden sm:block text-sm font-bold text-(--foreground) hover:text-primary transition-colors px-4"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-xl bg-primary text-(--primary-foreground) text-sm font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-48 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="w-3.5 h-3.5" />
                Evolution of Workplace Support
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-(--foreground) tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                Your <span className="text-primary italic">Supportive</span> Workplace <br /> 
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Companion</span>
              </h1>
              <p className="text-xl text-(--muted-foreground) font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                Buddy is an AI companion built with empathy at its core. We help you navigate workplace challenges and manage stress through secure, human-like conversations.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <Link
                  href="/auth/register"
                  className="group px-8 py-4 rounded-2xl bg-primary text-(--primary-foreground) font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-(--foreground) font-black text-lg border border-(--border) hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                >
                  Sign In
                </Link>
              </div>
              
              <div className="flex items-center gap-4 pt-8 animate-in fade-in duration-1000 delay-500">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-(--muted-foreground)">
                  Trusted by <span className="text-primary">2,500+</span> employees worldwide
                </p>
              </div>
            </div>

            <div className="relative animate-in zoom-in duration-1000 delay-300">
              <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl" />
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span className="text-white text-xl font-serif">B</span>
                  </div>
                  <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-3xl rounded-tl-none border border-primary/10">
                    <p className="text-base font-medium text-(--foreground)">
                      Hey Ankit! 👋 I noticed you've been working late this week. How are you feeling today? I'm here if you want to talk about the pressure.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 justify-end">
                  <div className="p-5 bg-white dark:bg-slate-700 rounded-3xl rounded-tr-none shadow-sm border border-(--border) max-w-[85%]">
                    <p className="text-base font-medium text-(--foreground)">
                      Thanks Buddy. It's been a lot with the new project deadlines. I'm feeling a bit overwhelmed.
                    </p>
                  </div>
                  <Avatar name="Ankit" size="sm" className="shrink-0 mt-4 shadow-md" />
                </div>
                
                <div className="mt-8 pt-8 border-t border-(--border)">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-(--muted-foreground)">Current Vibe</span>
                    <span className="text-xs font-black text-amber-500">Processing stress...</span>
                  </div>
                  <div className="h-3 bg-(--secondary) rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[65%] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Core Capabilities</h2>
              <p className="text-4xl md:text-5xl font-black text-(--foreground) tracking-tight">Built for <span className="italic text-primary">Human</span> Connection</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-[2rem] bg-white dark:bg-slate-800 border border-(--border) hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-(--secondary) flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-(--foreground) mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-(--muted-foreground) font-medium text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="about" className="py-32 bg-primary dark:bg-emerald-950 text-(--primary-foreground) rounded-[4rem] mx-6 mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 opacity-10">
            <BuddyAvatar size="lg" className="w-96 h-96 scale-150 rotate-12" />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
            <Smile className="w-16 h-16 mx-auto opacity-50 mb-8" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              Empathy is at the heart of everything we do.
            </h2>
            <p className="text-xl md:text-2xl font-medium opacity-80 leading-relaxed max-w-2xl mx-auto">
              We started Buddy with one mission: to make sure no employee ever feels unsupported in their workplace. Our AI is trained to listen first, analyze second.
            </p>
            <div className="pt-8">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-primary font-black text-xl hover:scale-110 transition-transform active:scale-95 shadow-2xl"
              >
                Join the Mission
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-(--border) py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white text-xl font-serif">B</span>
              </div>
              <span className="text-xl font-black tracking-tight">Buddy</span>
            </div>
            <p className="text-(--muted-foreground) font-medium max-w-sm">
              Supporting the global workforce through empathetic AI connection and intelligent wellbeing insights.
            </p>
          </div>
          
          <div>
             <h4 className="text-sm font-black uppercase tracking-widest mb-6">Product</h4>
             <ul className="space-y-4 text-sm font-bold text-(--muted-foreground)">
                <li><Link href="/chat" className="hover:text-primary transition-colors">Chat</Link></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors">Analytics</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Safety</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-sm font-black uppercase tracking-widest mb-6">Company</h4>
             <ul className="space-y-4 text-sm font-bold text-(--muted-foreground)">
                <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-(--border) flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-(--muted-foreground)">
            © {new Date().getFullYear()} Buddy AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             {/* Simple social placeholders */}
             <div className="w-5 h-5 bg-(--muted) rounded-full" />
             <div className="w-5 h-5 bg-(--muted) rounded-full" />
             <div className="w-5 h-5 bg-(--muted) rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}
