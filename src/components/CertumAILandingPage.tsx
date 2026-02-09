import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Quote } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import NavButtonWrapper from "./NavButtonWrapper";
import { DemoBanner } from "./DemoBanner";

export default function CertumAILandingPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <DemoBanner />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DetailedFeaturesSection />
      <StatisticsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="border-b border-border/60 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-1">
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              CERTUM
            </span>
            <span className="font-mono text-xs text-copper font-medium -translate-y-1.5">
              AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#stories"
              className="text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Stories
            </a>
          </div>

          <div className="flex items-center gap-4">
            <NavButtonWrapper />
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO SECTION — Asymmetric editorial spread
   ───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle diagonal line pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] text-foreground"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 39px, currentColor 39px, currentColor 40px)",
        }}
      />

      {/* Copper gradient mesh — soft glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.06]">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, oklch(0.62 0.16 45) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 py-24 sm:py-32 lg:py-40 items-center">
          {/* Left content — 7 columns */}
          <div className="lg:col-span-7 animate-editorial-up">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper mb-6">
              AI-Powered Career Intelligence
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] mb-6">
              Master your
              <br />
              next interview
              <br />
              <span className="text-copper italic font-normal">
                with certainty.
              </span>
            </h1>

            <p className="font-serif text-lg sm:text-xl text-muted-foreground italic leading-relaxed max-w-lg mb-10">
              The intelligent platform that transforms how professionals prepare
              for career-defining moments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <SignInButton forceRedirectUrl="/app">
                <button className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-3.5 text-xs font-sans uppercase tracking-[0.15em] font-medium hover:bg-copper hover:text-copper-foreground transition-colors duration-300 cursor-pointer">
                  Begin Preparation
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
              <a
                href="#features"
                className="text-xs font-sans uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground/30 pb-0.5"
              >
                Explore features
              </a>
            </div>
          </div>

          {/* Right visual — 5 columns: mock interview card */}
          <div className="lg:col-span-5 animate-editorial-up stagger-2 hidden lg:block">
            <div className="relative">
              {/* Tilted card */}
              <div className="transform rotate-[-2deg] border border-border bg-card shadow-xl p-6 relative">
                {/* Copper accent bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-copper" />

                <div className="pl-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-4">
                    Live Interview Session
                  </p>

                  <div className="space-y-4">
                    <div className="border-b border-border/50 pb-3">
                      <p className="font-mono text-[10px] text-muted-foreground mb-1">
                        00:32
                      </p>
                      <p className="font-sans text-sm text-foreground font-medium">
                        AI Interviewer
                      </p>
                      <p className="font-serif text-sm text-muted-foreground italic mt-1">
                        &ldquo;Tell me about a time you had to work with a
                        difficult team member.&rdquo;
                      </p>
                    </div>

                    <div className="border-b border-border/50 pb-3">
                      <p className="font-mono text-[10px] text-muted-foreground mb-1">
                        01:45
                      </p>
                      <p className="font-sans text-sm text-foreground font-medium">
                        You
                      </p>
                      <p className="font-sans text-sm text-muted-foreground mt-1">
                        &ldquo;In my previous role, I worked with a colleague
                        who often missed deadlines...&rdquo;
                      </p>
                    </div>

                    <div className="bg-copper/10 border border-copper/20 p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-copper mb-1">
                        Feedback
                      </p>
                      <p className="font-sans text-xs text-foreground">
                        Excellent use of the STAR method. Response was clear and
                        well-structured.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shadow card behind */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-border/30 -z-10 bg-muted/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES SECTION — Editorial columns with numbers
   ───────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      num: "01",
      title: "AI Interview Practice",
      description:
        "Practice with an AI interviewer that adapts to your target role. Real-time voice conversations with instant feedback on clarity, structure, and confidence.",
    },
    {
      num: "02",
      title: "Resume Intelligence",
      description:
        "Upload your resume against any job description. Receive precise optimization suggestions, ATS compatibility scores, and keyword gap analysis.",
    },
    {
      num: "03",
      title: "Job Description Analysis",
      description:
        "Decode what employers truly want. Extract key requirements, anticipate interview questions, and build tailored preparation strategies.",
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="container mx-auto">
        <div className="mb-16 animate-editorial-up">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper mb-4">
            The Toolkit
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground max-w-2xl">
            Everything you need to land the role
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-6xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group py-8 md:py-0 md:px-8 animate-editorial-up ${
                index > 0 ? "border-t md:border-t-0 md:border-l border-border" : ""
              }`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <span className="font-mono text-4xl sm:text-5xl font-bold text-border group-hover:text-copper transition-colors duration-500">
                {feature.num}
              </span>
              <h3 className="font-serif text-xl font-semibold text-foreground mt-4 mb-3">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   DETAILED FEATURES — Full editorial spreads
   ───────────────────────────────────────────── */
function DetailedFeaturesSection() {
  const spreads = [
    {
      label: "Interview Practice",
      title: "Conversations that build confidence",
      description:
        "Experience realistic mock interviews with our advanced AI that adapts to your experience level and target role. Every session sharpens your delivery.",
      points: [
        "Real-time voice conversation with adaptive AI",
        "Personalized questions based on job requirements",
        "Instant feedback on clarity and structure",
        "Behavioral and technical scenario practice",
      ],
      visual: {
        heading: "Session Analysis",
        items: [
          { label: "Clarity", score: "9.2", bar: 92 },
          { label: "Structure", score: "8.7", bar: 87 },
          { label: "Confidence", score: "8.4", bar: 84 },
          { label: "Relevance", score: "9.5", bar: 95 },
        ],
      },
    },
    {
      label: "Resume Analysis",
      title: "Every word, optimized",
      description:
        "Upload your resume alongside a job description. Our AI dissects both documents, identifying gaps, suggesting improvements, and scoring your compatibility.",
      points: [
        "ATS-friendly formatting recommendations",
        "Keyword optimization for specific postings",
        "Skills gap analysis and suggestions",
        "Achievement quantification guidance",
      ],
      visual: {
        heading: "Match Report",
        items: [
          { label: "Skills Match", score: "87%", bar: 87 },
          { label: "Experience", score: "92%", bar: 92 },
          { label: "ATS Score", score: "95%", bar: 95 },
          { label: "Keywords", score: "78%", bar: 78 },
        ],
      },
    },
    {
      label: "Job Intelligence",
      title: "Decode any job posting",
      description:
        "Paste any job description and receive a complete briefing. Understand what the employer truly prioritizes, and prepare accordingly.",
      points: [
        "Key requirements extraction and ranking",
        "Company culture and values analysis",
        "Custom interview questions prediction",
        "Preparation strategy recommendations",
      ],
      visual: {
        heading: "Extracted Requirements",
        items: [
          { label: "Must-Have", score: "4", bar: 100 },
          { label: "Preferred", score: "6", bar: 75 },
          { label: "Culture Fit", score: "3", bar: 85 },
          { label: "Questions", score: "12", bar: 90 },
        ],
      },
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/40 relative">
      <div className="container mx-auto">
        <div className="mb-20 text-center animate-editorial-up">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper mb-4">
            In Detail
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Built for serious preparation
          </h2>
        </div>

        <div className="space-y-28 max-w-6xl mx-auto">
          {spreads.map((spread, index) => {
            const isReverse = index % 2 === 1;

            return (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  isReverse ? "lg:[direction:rtl] lg:*:[direction:ltr]" : ""
                }`}
              >
                {/* Content side */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-4">
                    {spread.label}
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {spread.title}
                  </h3>

                  {/* Copper rule */}
                  <div className="w-12 h-0.5 bg-copper mb-6" />

                  <p className="font-sans text-muted-foreground leading-relaxed mb-8">
                    {spread.description}
                  </p>

                  <div className="space-y-3">
                    {spread.points.map((point, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-copper font-serif text-sm mt-0.5 shrink-0">
                          &mdash;
                        </span>
                        <span className="font-sans text-sm text-foreground">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual side — dark panel */}
                <div className="bg-foreground text-background p-8 relative">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-copper" />

                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-6">
                    {spread.visual.heading}
                  </p>

                  <div className="space-y-5">
                    {spread.visual.items.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-sans text-sm text-background/70">
                            {item.label}
                          </span>
                          <span className="font-mono text-sm font-medium text-copper">
                            {item.score}
                          </span>
                        </div>
                        <div className="w-full h-px bg-background/10 relative">
                          <div
                            className="absolute top-0 left-0 h-full bg-copper"
                            style={{ width: `${item.bar}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATISTICS SECTION — Inverted dark band
   ───────────────────────────────────────────── */
function StatisticsSection() {
  const stats = [
    {
      value: "3x",
      label: "Faster Placement",
      detail: "Land jobs in 6 weeks vs. 18 weeks industry average",
    },
    {
      value: "78%",
      label: "First-Interview Offers",
      detail: "Users receive offers after their first interview attempt",
    },
    {
      value: "2.4x",
      label: "Higher Salary Offers",
      detail: "Compared to candidates without structured preparation",
    },
  ];

  return (
    <section className="bg-foreground text-background py-20 sm:py-28 relative overflow-hidden">
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper mb-4">
            Proven Results
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-background">
            Numbers that speak for themselves
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center py-8 md:py-0 md:px-10 ${
                index > 0
                  ? "border-t md:border-t-0 md:border-l border-background/10"
                  : ""
              }`}
            >
              <div className="font-mono text-5xl sm:text-6xl lg:text-7xl font-bold text-copper mb-3 tracking-tight">
                {stat.value}
              </div>
              <h3 className="font-serif text-lg font-semibold text-background mb-2">
                {stat.label}
              </h3>
              <p className="font-sans text-sm text-background/50 leading-relaxed max-w-xs mx-auto">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/30">
            Based on internal data from 10,000+ successful placements, 2023-2024
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS — Pull-quote editorial style
   ───────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content:
        "The interview practice was extraordinary. The AI feedback helped me identify weak spots I never knew I had. Landed my dream role after just three interviews.",
      featured: true,
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      company: "Microsoft",
      content:
        "The resume optimization completely transformed my applications. I went from one interview per twenty applications to one in every three.",
      featured: false,
    },
    {
      name: "Emily Thompson",
      role: "Data Scientist",
      company: "Netflix",
      content:
        "As someone who struggled with technical interviews, the tailored practice sessions were transformative. The AI understood exactly what I needed to work on.",
      featured: false,
    },
    {
      name: "David Park",
      role: "UX Designer",
      company: "Airbnb",
      content:
        "I was skeptical about AI coaching, but this proved me wrong. The personalized feedback felt like having a career coach available around the clock. Three offers in one month.",
      featured: true,
    },
    {
      name: "Jennifer Wu",
      role: "DevOps Engineer",
      company: "Stripe",
      content:
        "The job description analysis helped me understand what employers really wanted. I could tailor my responses perfectly.",
      featured: false,
    },
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      company: "Shopify",
      content:
        "This platform helped me transition from junior to senior level. The interview preparation was so thorough that I felt confident in every conversation.",
      featured: false,
    },
  ];

  return (
    <section id="stories" className="py-24 sm:py-32 relative">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper mb-4">
            Success Stories
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Trusted by thousands of professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`relative py-8 px-6 ${
                t.featured
                  ? "border-l-4 border-l-copper bg-copper/[0.03]"
                  : "border-l border-l-border"
              }`}
            >
              {/* Decorative quote mark */}
              <Quote className="absolute top-4 right-6 w-8 h-8 text-border/50" />

              <blockquote className="font-serif text-foreground leading-relaxed mb-6 relative z-10 italic">
                &ldquo;{t.content}&rdquo;
              </blockquote>

              <div>
                <p className="font-sans text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  {t.role} &middot; {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 space-y-4">
          <p className="font-sans text-sm text-muted-foreground">
            Join over 50,000 professionals who trust CertumAI
          </p>
          <div className="flex justify-center items-center gap-8 text-muted-foreground/50">
            <span className="font-mono text-xs uppercase tracking-wider">
              Featured in:
            </span>
            <span className="font-serif text-sm italic">TechCrunch</span>
            <span className="font-serif text-sm italic">Forbes</span>
            <span className="font-serif text-sm italic">
              Harvard Business Review
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRICING SECTION
   ───────────────────────────────────────────── */
function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/40 relative">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-copper mb-4">
            Investment
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose your path forward
          </h2>
          <p className="font-sans text-muted-foreground max-w-xl mx-auto">
            Start free and upgrade as you advance. All plans include our core AI
            features.
          </p>
        </div>

        {/* Guarantees bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {["30-day money-back guarantee", "Cancel anytime", "24/7 support"].map(
            (item) => (
              <span
                key={item}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                {item}
              </span>
            )
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Top rule */}
          <div className="h-px bg-border mb-8" />

          <div className="bg-card border border-border p-8">
            <PricingTable />
          </div>

          {/* Bottom rule */}
          <div className="h-px bg-border mt-8" />
        </div>

        <div className="text-center mt-12 flex flex-wrap justify-center gap-8">
          {["No setup fees", "Instant activation", "Secure payments"].map(
            (item) => (
              <span
                key={item}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA SECTION — Dark, cinematic
   ───────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="bg-foreground text-background py-24 sm:py-32 relative overflow-hidden">
      {/* Copper gradient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.62 0.16 45) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10 text-center max-w-3xl">
        {/* Top rule */}
        <div className="w-12 h-0.5 bg-copper mx-auto mb-12" />

        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-background mb-6 leading-tight">
          Ready to ace your
          <br />
          next interview?
        </h2>
        <p className="font-sans text-background/60 mb-10 max-w-lg mx-auto">
          Join thousands of professionals who have successfully landed their
          dream roles with CertumAI.
        </p>
        <SignInButton forceRedirectUrl="/app">
          <button className="group inline-flex items-center gap-3 bg-copper text-copper-foreground px-10 py-4 text-xs font-sans uppercase tracking-[0.15em] font-medium hover:bg-copper/90 transition-colors duration-300 cursor-pointer">
            Start Your Free Trial
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </SignInButton>

        {/* Bottom rule */}
        <div className="w-12 h-0.5 bg-copper mx-auto mt-12" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER — Minimal editorial
   ───────────────────────────────────────────── */
function FooterSection() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-serif text-base font-bold tracking-tight text-foreground">
              CERTUM
            </span>
            <span className="font-mono text-[9px] text-copper font-medium -translate-y-1">
              AI
            </span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            &copy; 2025 CertumAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
