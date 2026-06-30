export type TabType =
  | 'dashboard'
  | 'live-monitoring'
  | 'analytics'
  | 'threat-intel'
  | 'model-performance'
  | 'logs'
  | 'settings';

export interface ThreatFeedItem {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'INFO' | 'LOW';
  actor: string;
  time: string;
  title: string;
  cve?: string;
  tag: string;
}

export interface LogItem {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'DEBUG' | 'HIGH';
  eventType: string;
  sourceIp: string;
  target: string;
  message: string;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string;
  lastActivity: string;
  sessionIp: string;
  active: boolean;
}

export interface MitreTechnique {
  name: string;
  activeState: 'full' | 'semi' | 'none';
}

export interface MitreColumn {
  title: string;
  borderColorClass: string;
  textColorClass: string;
  techniques: MitreTechnique[];
}

export interface MitigationItem {
  id: string;
  title: string;
  description: string;
  iconType: 'policy' | 'dns' | 'security';
}
