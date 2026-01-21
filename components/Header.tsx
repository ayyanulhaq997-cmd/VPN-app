
import React from 'react';
import { ConnectionStatus, UserProfile, VPNServer } from '../types';

interface HeaderProps {
  user: UserProfile;
  status: ConnectionStatus;
  server: VPNServer;
  publicIp: string;
}

const Header: React.FC<HeaderProps> = ({ user, status, server, publicIp }) => {
  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between z-10">
      <div>
        <h1 className="text-lg font-black text-white tracking-tight uppercase italic">Jutt VPN Pro</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <div className={`w-2 h-2 rounded-full ${status === ConnectionStatus.CONNECTED ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {status === ConnectionStatus.CONNECTED ? `Tunnel: ${server.name}` : 'Awaiting Connection'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase font-black text-indigo-500 tracking-widest">Public Endpoint</span>
          <span className="text-sm font-mono font-bold text-white leading-none mt-1">
            {status === ConnectionStatus.CONNECTED ? server.ip : publicIp}
          </span>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-800" />

        <div className="flex items-center gap-4">
           <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.plan} Account</p>
           </div>
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {user.name.charAt(0)}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
