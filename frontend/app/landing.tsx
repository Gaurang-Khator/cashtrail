'use client';

import Link from "next/link";
import { Cloud, TrendingUp, BarChart3, Lock, Zap } from "lucide-react";
import Footer  from "@/components/Footer";

export function Landing() {
  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-background/95">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-primary fill-primary/20" />
            <span className="font-bold text-xl">CashTrail</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Track Your <span className="text-green-400">Money</span> Effortlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              CashTrail helps you manage expenses, track income, and understand your spending patterns with ease.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/sign-up"
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-card transition-colors"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose CashTrail?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
            <p className="text-muted-foreground">
              Easily log your daily expenses and categorize them for better insights.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Reports</h3>
            <p className="text-muted-foreground">
              Get detailed reports and visualizations of your spending habits.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your financial data is encrypted and secure with industry-standard protection.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
            <p className="text-muted-foreground">
              Access your finances instantly from any device, anywhere, anytime.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
              <Cloud className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cloud Sync</h3>
            <p className="text-muted-foreground">
              All your data synced across devices in real-time.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-lg border border-border bg-card/40 hover:bg-card/60 transition-colors">
            <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
            <p className="text-muted-foreground">
              Get AI-powered recommendations to optimize your spending.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-lg bg-linear-to-r from-primary/20 to-green-400/20 border border-primary/50 p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Start Managing Your Money Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are taking control of their finances with CashTrail.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
      
    </main>
  );
}