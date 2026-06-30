import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, ShieldCheck, Database, Layers, Radio, Play, RefreshCw } from 'lucide-react';

interface ThreatVector {
  name: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export default function AnalyticsView() {
  const [activeVector, setActiveVector] = useState<string | null>(null);
  const [trendScale, setTrendScale] = useState<'hourly' | 'daily' | 'weekly'>('hourly');

  const threatVectors: ThreatVector[] = [
    { name: 'Ransomware', count: 124, percentage: 38, trend: 'up', color: 'bg-error' },
    { name: 'SQL Injection', count: 89, percentage: 27, trend: 'stable', color: 'bg-primary' },
    { name: 'Phishing Vectors', count: 62, percentage: 19, trend: 'up', color: 'bg-secondary' },
    { name: 'Credential Stuffing', count: 32, percentage: 10, trend: 'down', color: 'bg-tertiary' },
    { name: 'Brute Force Attempts', count: 19, percentage: 6, trend: 'down', color: 'bg-outline' },
  ];

  // Simulated subnet audit list
  const subnets = [
    { subnet: '10.0.4.0/24', label: 'Internal Workstations', risk: 'LOW', devices: 142, status: 'Audited' },
    { subnet: '192.168.1.0/24', label: 'Production Database cluster', risk: 'HIGH', devices: 12, status: 'Active Audit' },
    { subnet: '172.16.0.0/16', label: 'DMZ Core Loadbalancers', risk: 'MEDIUM', devices: 34, status: 'Secured' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs text-on-surface-variant uppercase">Threat Intel Coverage</p>
            <h3 className="text-3xl font-bold font-sans text-primary">98.4%</h3>
            <span className="text-[10px] font-mono text-secondary-fixed-dim">Updated 4m ago</span>
          </div>
          <Layers className="w-10 h-10 text-primary opacity-20" />
        </div>

        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs text-on-surface-variant uppercase">Active HoneyPots</p>
            <h3 className="text-3xl font-bold font-sans text-secondary-fixed-dim">12 Active</h3>
            <span className="text-[10px] font-mono text-secondary-fixed-dim">Simulating network endpoints</span>
          </div>
          <Radio className="w-10 h-10 text-secondary-fixed-dim opacity-20 animate-pulse" />
        </div>

        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs text-on-surface-variant uppercase">Subnet Risk Index</p>
            <h3 className="text-3xl font-bold font-sans text-error">Critical (2.1)</h3>
            <span className="text-[10px] font-mono text-error">Vulnerabilities flagged on Prod SQL</span>
          </div>
          <AlertCircle className="w-10 h-10 text-error opacity-20" />
        </div>
      </div>

      {/* Main vector breakdown & chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat breakdown selector */}
        <div className="lg:col-span-5 glass-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider mb-2">
              Threat Vector Distribution
            </h3>
            <p className="text-xs text-on-surface-variant/70 mb-6">
              Primary attack tactics identified in the last 24 hours. Click any vector to highlight detail status.
            </p>

            <div className="space-y-4">
              {threatVectors.map((vector) => (
                <div
                  key={vector.name}
                  onClick={() => setActiveVector(vector.name)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeVector === vector.name
                      ? 'bg-primary-container/10 border-primary shadow-lg scale-[1.01]'
                      : 'bg-surface-container-low border-outline-variant/15 hover:bg-surface-container-high/50'
                  }`}
                >
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span className="text-on-surface">{vector.name}</span>
                    <span className="text-primary">{vector.percentage}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-outline-variant/20 h-1.5 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full ${vector.color}`}
                      style={{ width: `${vector.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant/60 font-mono">
                    <span>{vector.count} incidents</span>
                    <span className="capitalize font-semibold text-secondary-fixed-dim">
                      {vector.trend} Trend
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeVector && (
            <div className="bg-primary-container/5 border border-primary/20 p-3 rounded-lg text-xs font-mono mt-4 text-on-surface-variant leading-relaxed">
              <span className="text-primary font-bold">Deep Intel:</span> High volume signatures associated with <strong>{activeVector}</strong> are isolated via enterprise firewalls instantly.
            </div>
          )}
        </div>

        {/* Hourly intrusion trend chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider">
                  Hourly Intrusion Trend Graph
                </h3>
                <p className="text-xs text-on-surface-variant/70 mt-1">
                  Active malicious signature blocks mapped across temporal intervals.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container rounded p-1 border border-outline-variant/20">
                {(['hourly', 'daily', 'weekly'] as const).map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setTrendScale(scale)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all ${
                      trendScale === scale
                        ? 'bg-primary text-on-primary font-bold'
                        : 'text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            {/* High Fidelity SVG Graph */}
            <div className="relative h-64 w-full bg-black/10 rounded-lg p-2 overflow-hidden flex items-end">
              <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#aec6ff" stopOpacity="0.25"></stop>
                    <stop offset="100%" stopColor="#aec6ff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                <line x1="0" y1="60" x2="800" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="180" x2="800" y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Shaded Area */}
                <path
                  d="M 0 180 Q 150 120, 300 160 T 600 70 T 800 50 L 800 240 L 0 240 Z"
                  fill="url(#trendGrad)"
                />

                {/* Smooth main line */}
                <path
                  d="M 0 180 Q 150 120, 300 160 T 600 70 T 800 50"
                  fill="none"
                  stroke="#aec6ff"
                  strokeWidth="3.5"
                  className="transition-all duration-1000"
                />

                {/* Dot markers */}
                <circle cx="300" cy="160" r="4.5" fill="#aec6ff" />
                <circle cx="600" cy="70" r="4.5" fill="#aec6ff" />
                <circle cx="780" cy="53" r="5" fill="#bdf4ff" className="animate-pulse" />
              </svg>

              <div className="absolute top-2 right-2 bg-surface-container-high/80 border border-outline-variant/30 px-2 py-1 rounded text-[10px] font-mono text-on-surface">
                Trend Index: <span className="text-secondary font-bold">Stable (0.84)</span>
              </div>
            </div>

            <div className="flex justify-between px-2 mt-2 font-mono text-[10px] text-on-surface-variant/50">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>LIVE</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/10 text-xs text-on-surface-variant/70 font-mono">
            <strong>Observation:</strong> Threat signature influx shows peak intensity during US & European overlapping operational business hours.
          </div>
        </div>
      </div>

      {/* Grid: Subnet Risk Profiles */}
      <div className="glass-card rounded-xl overflow-hidden p-6">
        <h3 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider mb-4">
          Subnet Active Audits & Security Risks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-container-low text-[10px] uppercase tracking-wider text-outline border-b border-outline-variant/10">
              <tr>
                <th className="px-4 py-3">Subnet Address</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Risk Rating</th>
                <th className="px-4 py-3">Active Host Nodes</th>
                <th className="px-4 py-3">Audit State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {subnets.map((sub, idx) => (
                <tr key={idx} className="hover:bg-surface-container-highest/10 transition-colors">
                  <td className="px-4 py-3 text-on-surface font-semibold">{sub.subnet}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{sub.label}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase ${
                        sub.risk === 'HIGH'
                          ? 'bg-error-container/20 text-error'
                          : sub.risk === 'MEDIUM'
                          ? 'bg-tertiary-container/10 text-tertiary'
                          : 'bg-primary-container/10 text-secondary-fixed-dim'
                      }`}
                    >
                      {sub.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{sub.devices} devices</td>
                  <td className="px-4 py-3 text-secondary-fixed-dim font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> {sub.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
