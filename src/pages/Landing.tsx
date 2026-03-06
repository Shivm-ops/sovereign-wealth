import { Link } from "react-router-dom";
import { TrendingUp, Shield, BarChart3, Zap, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketIndices } from "@/lib/mockData";

const features = [
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track market movements with precision using advanced charting tools." },
  { icon: Shield, title: "Secure Portfolio", desc: "Bank-grade encryption protects your financial data around the clock." },
  { icon: TrendingUp, title: "Smart Watchlists", desc: "Curate and monitor your favorite stocks with intelligent alerts." },
  { icon: Zap, title: "Lightning Fast", desc: "Sub-second data updates keep you ahead of market movements." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Ticker */}
      <div className="border-b border-border/30 bg-muted/30 overflow-hidden">
        <div className="flex animate-ticker gap-8 py-2 px-4 whitespace-nowrap">
          {[...marketIndices, ...marketIndices].map((idx, i) => (
            <span key={i} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{idx.name}</span>
              <span className="text-muted-foreground">{idx.value.toLocaleString()}</span>
              <span className={idx.change >= 0 ? "text-emerald" : "text-destructive"}>
                {idx.change >= 0 ? "+" : ""}{idx.change}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary" />
          <span className="text-xl font-display font-bold text-foreground">StockSphere</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-12 py-24 lg:py-36 max-w-6xl mx-auto text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-glow" />
            Markets are open
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Master the Markets with{" "}
            <span className="text-gradient-gold">Precision</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Professional-grade analytics, real-time data, and intelligent portfolio management — all in one elegant platform.
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8">
                Start Trading <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted text-base px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-4">
          Built for Serious <span className="text-gradient-gold">Investors</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Every feature crafted to give you the edge in today's fast-moving markets.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-12 text-center glow-gold">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Elevate Your Portfolio?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of investors who trust StockSphere for their market intelligence.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-10">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-sm">StockSphere</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 StockSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
