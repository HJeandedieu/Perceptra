import { Shield, Brain, Zap, Bell, ChevronRight, BarChart3, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-surface-950 text-gray-300">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-perceptra-critical flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-xl font-bold text-white">PERCEPTRA</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#technology" className="hover:text-white transition-colors">Technology</a>
          <button 
            onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors text-white"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-8 pt-16 pb-24 text-center">
        <h1 className="text-6xl font-bold text-white tracking-tighter mb-6 max-w-3xl mx-auto">
          Real-Time Threat Detection That <span className="text-accent-400">Never Blinks</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
          PERCEPTRA leverages state-of-the-art YOLOv8 AI to monitor surveillance feeds, 
          detect complex threats in milliseconds, and dispatch immediate alerts.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-lg shadow-lg shadow-accent-500/20 transition-all">
            Request Demo
          </button>
          <button className="px-6 py-3 bg-surface-800 hover:bg-surface-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all">
            View Analytics <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="px-8 py-20 bg-surface-900 border-y border-surface-800">
        <div className="grid md:grid-cols-3 gap-8">
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
      <footer className="px-8 py-12 text-center text-sm text-gray-600">
        &copy; 2026 PERCEPTRA Threat Detection Platform. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-surface-950 border border-surface-800">
      <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-accent-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
