
import React, { useState } from 'react';
import { ConnectionStatus, VPNServer } from '../types';
import { getSecurityAdvice } from '../services/geminiService';

interface SecurityCenterProps {
  status: ConnectionStatus;
  server: VPNServer;
  publicIp: string;
}

const SecurityCenter: React.FC<SecurityCenterProps> = ({ status, server, publicIp }) => {
  const [prompt, setPrompt] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    // Send public IP so Gemini can guess the best server for their region
    const context = { status, server, publicIp };
    const result = await getSecurityAdvice(prompt, context);
    setAdvice(result || "Error communicating with AI Advisor.");
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2rem] text-center">
        <h2 className="text-4xl font-black text-white mb-4">Smart Routing Engine</h2>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Our AI analyzes your real-time endpoint <span className="text-indigo-400 font-mono">({publicIp})</span> to select the lowest-latency Jutt VPN node.
        </p>
      </div>

      <div className="glass-effect rounded-3xl p-8 border border-slate-800">
        <form onSubmit={handleAsk} className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Network Consultation</label>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Find the best server for gaming in South Asia"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-40"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-black px-6 rounded-xl text-xs uppercase transition-all"
            >
              {loading ? 'ANALYZING...' : 'OPTIMIZE'}
            </button>
          </div>
        </form>

        {advice && (
          <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-indigo-500/10 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span className="font-black text-[10px] uppercase tracking-widest text-indigo-400">Path Optimization Logic</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium italic">
              "{advice}"
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-effect p-6 rounded-3xl">
          <h4 className="text-white font-bold mb-2">DNS Leak Protection</h4>
          <p className="text-xs text-slate-400 mb-4">Current Status: <span className="text-emerald-400 font-bold">SECURE</span></p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500" />
          </div>
        </div>
        <div className="glass-effect p-6 rounded-3xl">
          <h4 className="text-white font-bold mb-2">IPv6 Shield</h4>
          <p className="text-xs text-slate-400 mb-4">Current Status: <span className="text-emerald-400 font-bold">ACTIVE</span></p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Added missing default export to satisfy the import in App.tsx
export default SecurityCenter;
