
import React from 'react';
import { ConnectionStatus, VPNServer, BandwidthData, ConnectionLogs } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SpeedTest } from './NetworkTools';

interface DashboardProps {
  status: ConnectionStatus;
  server: VPNServer;
  bandwidth: BandwidthData[];
  toggle: () => void;
  connectionTime: number;
  logs: ConnectionLogs[];
  isTurbo: boolean;
  setIsTurbo: (val: boolean) => void;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
};

const MainDashboard: React.FC<DashboardProps> = ({ status, server, bandwidth, toggle, connectionTime, logs, isTurbo, setIsTurbo }) => {
  const isConnected = status === ConnectionStatus.CONNECTED;
  const isTransitioning = status === ConnectionStatus.CONNECTING || status === ConnectionStatus.DISCONNECTING;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="glass-effect rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          {isTurbo && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 animate-pulse" />}
          
          <h2 className="text-xl font-bold text-white mb-8">Connection Center</h2>
          
          <div className="relative mb-8">
            {isConnected && (
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
            )}
            
            <button
              onClick={toggle}
              disabled={isTransitioning}
              className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
                isConnected 
                  ? 'bg-indigo-600 shadow-indigo-500/40 scale-105' 
                  : isTransitioning
                    ? 'bg-amber-600 shadow-amber-500/40 cursor-wait'
                    : 'bg-slate-800 shadow-black/40 hover:bg-slate-700 hover:scale-105'
              }`}
            >
              <svg className={`w-14 h-14 mb-2 text-white ${isTransitioning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {isConnected ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>}
              </svg>
              <span className="text-white font-black text-lg tracking-widest">
                {isTransitioning ? '...' : isConnected ? 'SECURED' : 'CONNECT'}
              </span>
            </button>
          </div>

          <div className="w-full bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Turbo Mode</span>
              <button 
                onClick={() => setIsTurbo(!isTurbo)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isTurbo ? 'bg-indigo-600' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isTurbo ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-left">Enable AI-driven path optimization for 30% lower jitter.</p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Node</span>
              <span className="text-white font-medium">{server.flag} {server.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Uptime</span>
              <span className="text-indigo-400 font-mono font-bold">{formatTime(connectionTime)}</span>
            </div>
          </div>
        </div>

        <SpeedTest />
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="glass-effect rounded-3xl p-8">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-white">Traffic Analysis</h2>
                <p className="text-sm text-slate-400">{isTurbo ? 'Turbo mode active - Optimal routing' : 'Standard encryption active'}</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Inbound</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Outbound</span>
                 </div>
              </div>
           </div>

           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={bandwidth}>
                 <defs>
                   <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                 <XAxis dataKey="time" hide />
                 <YAxis hide domain={[0, 150]} />
                 <Area type="monotone" dataKey="download" stroke="#6366f1" fillOpacity={1} fill="url(#colorDown)" strokeWidth={3} isAnimationActive={false} />
                 <Area type="monotone" dataKey="upload" stroke="#a855f7" strokeWidth={3} fill="none" isAnimationActive={false} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 flex-1 overflow-hidden flex flex-col">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Traffic Console</h3>
           <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px]">
             {logs.length === 0 ? (
               <div className="animate-pulse text-slate-600">LISTENING FOR PACKETS...</div>
             ) : (
               logs.map((log, i) => (
                 <div key={i} className="flex gap-4 items-start py-1 border-b border-slate-800/30">
                    <span className="text-slate-500">[{log.timestamp}]</span>
                    <span className={log.status === 'success' ? 'text-emerald-400 font-bold' : log.status === 'warning' ? 'text-amber-400' : 'text-slate-300'}>
                      {log.event}
                    </span>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
