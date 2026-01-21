
import React, { useState } from 'react';
import { VPNServer } from '../types';

interface ServerListProps {
  servers: VPNServer[];
  selectedId: string;
  onSelect: (server: VPNServer) => void;
}

const ServerList: React.FC<ServerListProps> = ({ servers, selectedId, onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Global Network</h2>
          <p className="text-slate-400">Select a high-speed node from our global infrastructure</p>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search countries or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServers.map((server) => (
          <button
            key={server.id}
            onClick={() => onSelect(server)}
            className={`text-left glass-effect p-5 rounded-2xl border-2 transition-all group ${
              selectedId === server.id 
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' 
                : 'border-transparent hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-4">
                  <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{server.flag}</span>
                  <div>
                    <h3 className="text-white font-bold group-hover:text-indigo-400 transition-colors">{server.city}</h3>
                    <p className="text-xs text-slate-400">{server.country}</p>
                  </div>
               </div>
               {server.isPremium && (
                 <span className="bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase px-2 py-1 rounded border border-amber-500/20">Pro</span>
               )}
            </div>

            <div className="flex gap-6 mt-6">
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Latency</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${server.latency < 100 ? 'bg-emerald-500' : server.latency < 200 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <span className="text-sm font-mono text-white">{server.latency}ms</span>
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Load</span>
                  <span className="text-sm font-mono text-white">{server.load}%</span>
               </div>
               <div className="flex flex-col ml-auto">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Uptime</span>
                  <span className="text-sm font-mono text-emerald-400">99.9%</span>
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServerList;
