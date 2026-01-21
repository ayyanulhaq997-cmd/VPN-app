
import { VPNServer } from './types';

export const SERVERS: VPNServer[] = [
  { id: 'us-east', name: 'USA - New York', country: 'United States', city: 'New York', flag: '🇺🇸', latency: 42, load: 65, ip: '104.26.2.14', isPremium: false },
  { id: 'us-west', name: 'USA - San Francisco', country: 'United States', city: 'San Francisco', flag: '🇺🇸', latency: 85, load: 40, ip: '104.28.1.1', isPremium: true },
  { id: 'uk-lon', name: 'UK - London', country: 'United Kingdom', city: 'London', flag: '🇬🇧', latency: 120, load: 88, ip: '185.12.33.4', isPremium: false },
  { id: 'de-fra', name: 'Germany - Frankfurt', country: 'Germany', city: 'Frankfurt', flag: '🇩🇪', latency: 135, load: 30, ip: '194.55.12.99', isPremium: false },
  { id: 'jp-tok', name: 'Japan - Tokyo', country: 'Japan', city: 'Tokyo', flag: '🇯🇵', latency: 210, load: 55, ip: '162.159.135.42', isPremium: true },
  { id: 'sg-sg', name: 'Singapore', country: 'Singapore', city: 'Singapore', flag: '🇸🇬', latency: 180, load: 72, ip: '128.199.123.4', isPremium: true },
  { id: 'au-syd', name: 'Australia - Sydney', country: 'Australia', city: 'Sydney', flag: '🇦🇺', latency: 280, load: 20, ip: '45.76.121.2', isPremium: true },
  { id: 'br-sp', name: 'Brazil - São Paulo', country: 'Brazil', city: 'São Paulo', flag: '🇧🇷', latency: 165, load: 45, ip: '177.71.128.1', isPremium: false },
];

export const MOCK_USER = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  plan: 'Pro' as const,
  expiryDate: '2025-12-31',
  avatar: 'https://picsum.photos/id/64/100/100'
};
