
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ConnectionStatus, VPNServer, BandwidthData, ConnectionLogs } from './types';
import { SERVERS, MOCK_USER } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import ServerList from './components/ServerList';
import SecurityCenter from './components/SecurityCenter';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'servers' | 'security' | 'settings'>('dashboard');
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [selectedServer, setSelectedServer] = useState<VPNServer>(SERVERS[0]);
  const [bandwidth, setBandwidth] = useState<BandwidthData[]>([]);
  const [logs, setLogs] = useState<ConnectionLogs[]>([]);
  const [connectionTime, setConnectionTime] = useState(0);
  const [publicIp, setPublicIp] = useState<string>('Detecting...');
  const [isTurbo, setIsTurbo] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Fetch real IP
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setPublicIp(data.ip))
      .catch(() => setPublicIp('182.161.42.11 (Simulated)'));
  }, []);

  // Simulate bandwidth data with "Turbo" multiplier
  useEffect(() => {
    const interval = setInterval(() => {
      setBandwidth(prev => {
        const multiplier = isTurbo ? 1.4 : 1.0;
        const newData = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          download: status === ConnectionStatus.CONNECTED ? (Math.random() * 50 + 20) * multiplier : 0,
          upload: status === ConnectionStatus.CONNECTED ? (Math.random() * 15 + 5) * multiplier : 0,
        };
        const updated = [...prev, newData];
        return updated.slice(-20);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [status, isTurbo]);

  useEffect(() => {
    if (status === ConnectionStatus.CONNECTED) {
      timerRef.current = window.setInterval(() => setConnectionTime(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
      setConnectionTime(0);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [status]);

  const toggleConnection = useCallback(() => {
    if (status === ConnectionStatus.DISCONNECTED) {
      setStatus(ConnectionStatus.CONNECTING);
      addLog(`Resolving Jutt VPN node: ${selectedServer.name}...`, 'info');
      
      setTimeout(() => {
        addLog(`Authenticating credentials...`, 'info');
        setTimeout(() => {
          addLog(`Encrypted tunnel handshake (AES-256)...`, 'info');
          setTimeout(() => {
            setStatus(ConnectionStatus.CONNECTED);
            addLog(`Secure connection established via WireGuard.`, 'success');
          }, 1000);
        }, 800);
      }, 800);
    } else if (status === ConnectionStatus.CONNECTED) {
      setStatus(ConnectionStatus.DISCONNECTING);
      addLog(`Flushing DNS cache...`, 'info');
      setTimeout(() => {
        setStatus(ConnectionStatus.DISCONNECTED);
        addLog(`VPN disconnected safely.`, 'warning');
      }, 1200);
    }
  }, [status, selectedServer]);

  const addLog = (event: string, status: ConnectionLogs['status']) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      event,
      status
    }, ...prev].slice(0, 50));
  };

  const changeServer = (server: VPNServer) => {
    if (status === ConnectionStatus.CONNECTED) {
      setStatus(ConnectionStatus.DISCONNECTING);
      setTimeout(() => {
        setSelectedServer(server);
        setStatus(ConnectionStatus.CONNECTING);
        setTimeout(() => {
          setStatus(ConnectionStatus.CONNECTED);
          addLog(`Switched to high-speed node: ${server.name}`, 'success');
        }, 1500);
      }, 800);
    } else {
      setSelectedServer(server);
      addLog(`Target node set: ${server.name}`, 'info');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={MOCK_USER} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={MOCK_USER} status={status} server={selectedServer} publicIp={publicIp} />
        <main className="flex-1 overflow-y-auto bg-slate-900/50 p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <MainDashboard 
                status={status} 
                server={selectedServer} 
                bandwidth={bandwidth} 
                toggle={toggleConnection}
                connectionTime={connectionTime}
                logs={logs}
                isTurbo={isTurbo}
                setIsTurbo={setIsTurbo}
              />
            )}
            {activeTab === 'servers' && <ServerList servers={SERVERS} selectedId={selectedServer.id} onSelect={changeServer} />}
            {activeTab === 'security' && <SecurityCenter status={status} server={selectedServer} publicIp={publicIp} />}
            {activeTab === 'settings' && (
              <div className="p-8 text-center text-slate-400">
                <h2 className="text-2xl font-bold text-white mb-4">Core Settings</h2>
                <div className="max-w-md mx-auto bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                  <div className="flex justify-between items-center mb-4">
                    <span>Protocol</span>
                    <select className="bg-slate-700 border-none rounded-lg px-3 py-1 text-white">
                      <option>WireGuard (Recommended)</option>
                      <option>OpenVPN (UDP)</option>
                      <option>IKEv2</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Kill Switch</span>
                    <input type="checkbox" className="w-10 h-5 bg-indigo-600 rounded-full" defaultChecked />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
