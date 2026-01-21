
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING'
}

export interface VPNServer {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  latency: number;
  load: number;
  ip: string;
  isPremium: boolean;
}

export interface BandwidthData {
  time: string;
  download: number;
  upload: number;
}

export interface ConnectionLogs {
  timestamp: string;
  event: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface UserProfile {
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  expiryDate: string;
  avatar: string;
}
