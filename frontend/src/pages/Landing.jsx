import { Shield, Brain, Zap, Bell, ChevronRight } from 'lucide-react';
import landingHero from '../assets/images/landing-hero.jpg';

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen text-gray-300" style={{ backgroundColor: '#0a0b10' }}>
      {/* Navbar - glass */}
      <nav className="glass-nav flex items-center justify-between px-8 py-4 fixed top-0 w-full z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center shadow-lg shadow-accent-500/20">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-xl font-bold text-white">PERCEPTRA</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <button 
            onClick={() => onNavigate('login')}
            className="px-4 py-2 glass hover:bg-white/10 rounded-lg transition-all text-white"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('signup')}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-accent-500/20"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex items-center justify-center px-8 text-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${landingHero})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/70 to-[#0a0b10]/30" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="glass-card rounded-2xl px-10 py-12 inline-block w-full">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-6">
              Real-Time Threat Detection That <span className="text-accent-400">Never Blinks</span>
            </h1>
            <p className="text-base text-gray-400 mb-8 max-w-xl mx-auto">
              PERCEPTRA leverages state-of-the-art YOLOv8 AI to monitor surveillance feeds, 
              detect complex threats in milliseconds, and dispatch immediate alerts.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-lg shadow-lg shadow-accent-500/20 transition-all">
                Request Demo
              </button>
              <button className="px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-lg flex items-center gap-2 transition-all">
                View Analytics <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="px-8 py-24" style={{ backgroundColor: '#0a0b10' }}>
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why PERCEPTRA</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={Brain} 
            title="YOLOv8 AI Engine" 
            desc="Advanced per-frame analysis identifying persons, weapons, and aggressive behaviour."
          />
          <FeatureCard 
            icon={Zap} 
            title="Millisecond Latency" 
            desc="WebSocket-powered real-time event streaming for immediate operator action."
          />
          <FeatureCard 
            icon={Bell} 
            title="Severity Alerts" 
            desc="Automated escalation: SMS for Medium threats, Email for High/Critical breaches."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 text-center text-sm text-gray-600 border-t border-white/5">
        &copy; 2026 PERCEPTRA Threat Detection Platform. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="glass-card rounded-2xl p-7 hover:bg-white/[0.08] transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4 backdrop-blur-sm">
        <Icon className="w-6 h-6 text-accent-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
