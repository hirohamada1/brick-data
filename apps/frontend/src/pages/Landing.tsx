"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  Moon,
  Sun,
  ArrowRight,
  Check,
  Code2,
  Shield,
  Cpu,
  GitBranch,
  Zap,
  Users,
  Terminal,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  {
    icon: Code2,
    title: "Agentic Workflows",
    description:
      "Learn to supervise AI coding agents, define goals, and verify outputs in multi-step development workflows.",
  },
  {
    icon: Shield,
    title: "Verification Engineering",
    description:
      "Master property-based testing, static analysis, and formal verification to validate AI-generated code.",
  },
  {
    icon: Cpu,
    title: "Systems Fundamentals",
    description:
      "Deep dive into memory, concurrency, and distributed systems - the knowledge that distinguishes experts.",
  },
  {
    icon: Layers,
    title: "Type-Driven Development",
    description:
      "Leverage TypeScript, Rust, and typed languages to narrow the search space for both humans and AI.",
  },
];

const stats = [
  { value: "84%", label: "of developers using AI tools", source: "Stack Overflow 2025" },
  { value: "66%", label: "say AI output needs human review", source: "Industry Survey" },
  { value: "10x", label: "productivity with proper verification", source: "Engineering Reports" },
  { value: "5x", label: "faster debugging with fundamentals", source: "Team Metrics" },
];

const curriculum = [
  {
    module: "01",
    title: "Fundamentals",
    topics: ["Data structures & algorithms", "Memory & performance", "Networking basics", "Database patterns"],
  },
  {
    module: "02",
    title: "Tool Leverage",
    topics: ["AI coding assistants", "Agentic workflows", "Prompt engineering", "Output verification"],
  },
  {
    module: "03",
    title: "System Design",
    topics: ["Architecture patterns", "Distributed systems", "API design", "Scalability principles"],
  },
  {
    module: "04",
    title: "Verification",
    topics: ["Testing strategies", "Static analysis", "Security auditing", "Code review workflows"],
  },
];

const codeSnippet = `// Traditional approach
function processData(data) {
  // 50 lines of manual implementation
  // Error-prone, time-consuming
}

// Future approach: specify intent
const spec = {
  goal: "Process user data securely",
  constraints: ["GDPR compliant", "< 100ms"],
  tests: ["handles null", "validates schema"],
  verify: true
};

// Agent generates, you verify
const result = await agent.implement(spec);
assert(result.passes(spec.tests));`;

export function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tight">
              Stack<span className="text-accent">Proof</span>
            </span>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Skills
              </a>
              <a href="#curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Curriculum
              </a>
              <a href="#approach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Approach
              </a>
              <a href="#waitlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Join Waitlist
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
            <Button size="sm" asChild>
              <a href="#waitlist">Get Early Access</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
          
          <div className="container relative mx-auto px-4 md:px-8 py-24 md:py-32 lg:py-40">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                The future of programming is here
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                Master programming in the{" "}
                <span className="text-accent">AI-assisted</span> era
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Programming is shifting from writing code to supervising AI agents, 
                verifying outputs, and architecting systems. Learn the skills that matter.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button size="lg" className="px-8" asChild>
                  <a href="#waitlist">
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#approach">Explore the Approach</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
              {stats.map((stat, i) => (
                <div key={i} className="px-6 py-8 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-muted-foreground/60 mt-1">{stat.source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-accent mb-3">Core Competencies</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The skills that define future engineers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                As AI handles more implementation, the differentiating skills shift to 
                architecture, verification, and systems thinking.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, i) => (
                <div
                  key={skill.title}
                  className="group relative p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4 group-hover:bg-accent/20 transition-colors">
                    <skill.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Comparison Section */}
        <section id="approach" className="py-20 md:py-28 border-y border-border bg-secondary/20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <p className="text-sm font-medium text-accent">The Paradigm Shift</p>
                <h2 className="text-3xl md:text-4xl font-bold">
                  From writing instructions to specifying intent
                </h2>
                <p className="text-muted-foreground">
                  The future programmer looks more like a specification + verification engineer 
                  than a pure code writer. Define goals, constraints, and tests - then verify what AI produces.
                </p>
                <ul className="space-y-3">
                  {[
                    "Define acceptance criteria upfront",
                    "Let agents handle implementation details",
                    "Focus on review, integration, and tradeoffs",
                    "Build verification into every workflow",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/5 rounded-2xl blur-2xl" />
                <div className="relative rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-chart-3/60" />
                      <div className="w-3 h-3 rounded-full bg-accent/60" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">future-code.ts</span>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="text-muted-foreground font-mono">{codeSnippet}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section id="curriculum" className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-accent mb-3">Learning Path</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                A curriculum built for the future
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four modules that combine timeless fundamentals with emerging skills 
                in AI collaboration and verification.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {curriculum.map((module, i) => (
                <div
                  key={module.module}
                  className="p-6 rounded-xl border border-border bg-card"
                >
                  <div className="text-5xl font-bold text-muted-foreground/20 mb-4">
                    {module.module}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{module.title}</h3>
                  <ul className="space-y-2">
                    {module.topics.map((topic, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 border-y border-border bg-secondary/20">
          <div className="container mx-auto px-4 md:px-8">
            <blockquote className="max-w-3xl mx-auto text-center">
              <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
                &ldquo;The easier it becomes to generate code, the more valuable it becomes to verify code.&rdquo;
              </p>
              <footer className="text-muted-foreground">
                <span className="font-medium">The core principle</span> — StackProof Methodology
              </footer>
            </blockquote>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 rounded-xl border border-border bg-card">
                <Terminal className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hands-on Projects</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Build real systems where architecture decisions matter. No toy examples - 
                  work on codebases that teach you to think at scale.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-border bg-card">
                <Users className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Community</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Learn alongside engineers from top companies. Get code reviews from 
                  practitioners who build production systems daily.
                </p>
              </div>
              <div className="p-8 rounded-xl border border-border bg-card">
                <GitBranch className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Career Trajectory</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Position yourself for the roles that matter: technical director, 
                  staff engineer, architect. Not just another prompt engineer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-20 md:py-28 border-t border-border">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-sm text-accent mb-6">
                <Zap className="h-4 w-4" />
                Limited early access
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the waitlist
              </h2>
              <p className="text-muted-foreground mb-8">
                Be among the first to access StackProof when we launch. 
                Early members get lifetime discounts and shape the curriculum.
              </p>
              
              {submitted ? (
                <div className="p-6 rounded-xl border border-accent/30 bg-accent/10">
                  <Check className="h-8 w-8 text-accent mx-auto mb-3" />
                  <p className="font-medium text-foreground">You&apos;re on the list!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ll reach out when early access opens.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button type="submit" size="lg" className="px-8">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
              
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xl font-bold tracking-tight">
                Stack<span className="text-accent">Proof</span>
              </span>
              <p className="text-sm text-muted-foreground mt-1">
                Future-proof your programming career.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StackProof. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
