import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Cpu, Globe, Fullscreen, Flame, Play, ShieldAlert, CheckCircle, HelpCircle, Ban, ArrowUpRight } from 'lucide-react';
import { activeConnections } from '../data/mockData';

export default function DashboardView() {
  const [stats, setStats] = useState({
    attacksBlocked: 12482,
    criticalAlerts: 15,
    avgResponseTime: 140,
    networkLoad: 92,
  });

  const [connections, setConnections] = useState(activeConnections);
  const [lastIncident, setLastIncident] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(true);

  // CPU and RAM dynamic oscillation
  const [cpuUsage, setCpuUsage] = useState(80);
  const [ramUsage, setRamUsage] = useState(45);

  // Attack map nodes
  const [nodes, setNodes] = useState([
    { id: 'CN_SHANGHAI', label: 'ATTACK_NODE: CN_SHANGHAI', x: '35%', y: '28%', active: true, ping: true },
    { id: 'EU_FRANKFURT', label: 'ATTACK_NODE: EU_FRANKFURT', x: '48%', y: '35%', active: true, ping: true },
    { id: 'AS_TOKYO', label: 'ATTACK_NODE: AS_TOKYO', x: '78%', y: '25%', active: false, ping: false },
    { id: 'US_EAST_01', label: 'GATEWAY: US_EAST_01', x: '22%', y: '40%', active: true, ping: false },
  ]);

  // Traffic line path generator for animation
  const [trafficOffset, setTrafficOffset] = useState(0);

  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Simulate traffic line moving
      setTrafficOffset((prev) => (prev + 5) % 100);

      // Simulate cpu & ram load oscillation
      setCpuUsage((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        const next = prev + change;
        return Math.max(55, Math.min(95, next));
      });

      setRamUsage((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        const next = prev + change;
        return Math.max(40, Math.min(48, next));
      });

      // Periodically trigger a fake block or counter increase
      setStats((prev) => ({
        ...prev,
        attacksBlocked: prev.attacksBlocked + (Math.random() > 0.6 ? 1 : 0),
        avgResponseTime: Math.max(120, Math.min(160, prev.avgResponseTime + (Math.floor(Math.random() * 5) - 2))),
      }));

      // Randomly toggle map node ping state
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== 'US_EAST_01' && Math.random() > 0.7) {
            return { ...node, ping: !node.ping };
          }
          return node;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  const handleBlockIp = (ip: string) => {
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.ip === ip) {
          return { ...conn, status: 'BLOCKED' };
        }
        return conn;
      })
    );
    setStats((prev) => ({
      ...prev,
      criticalAlerts: Math.max(0, prev.criticalAlerts - 1),
    }));
    setLastIncident(`Manually blocked IP protocol stream: ${ip}`);
  };

  const handleSimulateAttack = () => {
    setStats((prev) => ({
      ...prev,
      criticalAlerts: prev.criticalAlerts + 1,
    }));
    setCpuUsage(94);
    // activate Tokyo node
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'AS_TOKYO') {
          return { ...n, active: true, ping: true };
        }
        return n;
      })
    );
    setLastIncident('Warning: Simulated Port-Scan Flood detected from Asia-Pacific endpoint!');
    setTimeout(() => {
      setCpuUsage(80);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      {lastIncident && (
        <div className="bg-primary-container/20 border border-primary/40 px-4 py-3 rounded-lg flex items-center justify-between text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-secondary-fixed-dim animate-pulse" />
            <span className="text-on-background font-semibold">SOC ACTION REGISTERED:</span>
            <span className="text-on-surface-variant">{lastIncident}</span>
          </div>
          <button
            onClick={() => setLastIncident(null)}
            className="text-primary hover:underline hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attacks Blocked */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute top-4 right-4 p-2 bg-primary/10 rounded-lg text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <p className="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">
            Attacks Blocked (24h)
          </p>
          <h2 className="text-4xl font-bold text-primary font-sans">
            {stats.attacksBlocked.toLocaleString()}
          </h2>
          <p className="text-xs text-secondary mt-2 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3 text-secondary" /> +14.2% from daily average
          </p>
        </div>

        {/* Critical Alerts */}
        <div className="glass-card p-6 rounded-xl border-l-4 border-error relative overflow-hidden hover:border-error/50 transition-all">
          <div className="absolute top-4 right-4 p-2 bg-error/10 rounded-lg text-error">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">
            Critical Alerts
          </p>
          <h2 className="text-4xl font-bold text-error font-sans">
            {stats.criticalAlerts}
          </h2>
          <p className="text-xs text-error mt-2 flex items-center gap-1 font-mono">
            {stats.criticalAlerts > 0 ? (
              <span className="animate-pulse">● Immediate mitigation required</span>
            ) : (
              'All endpoints secure'
            )}
          </p>
        </div>

        {/* Response Time */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden hover:border-secondary-fixed-dim/30 transition-all">
          <div className="absolute top-4 right-4 p-2 bg-secondary/10 rounded-lg text-secondary">
            <Cpu className="w-5 h-5" />
          </div>
          <p className="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">
            Avg Response Time
          </p>
          <h2 className="text-4xl font-bold text-on-surface font-sans">
            {stats.avgResponseTime}ms
          </h2>
          <div className="w-full bg-outline-variant/20 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-secondary-fixed-dim h-full w-[85%] transition-all duration-1000" />
          </div>
        </div>

        {/* Network Load */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden hover:border-tertiary/30 transition-all">
          <div className="absolute top-4 right-4 p-2 bg-tertiary/10 rounded-lg text-tertiary">
            <Flame className="w-5 h-5" />
          </div>
          <p className="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-wider font-semibold">
            Primary CPU Load
          </p>
          <h2 className="text-4xl font-bold text-tertiary font-sans">
            {cpuUsage}%
          </h2>
          <div className="flex gap-1 mt-4">
            <div className={`h-4 w-1 ${cpuUsage > 85 ? 'bg-error' : 'bg-primary'}`}></div>
            <div className={`h-4 w-1 ${cpuUsage > 85 ? 'bg-error' : 'bg-primary'}`}></div>
            <div className={`h-4 w-1 ${cpuUsage > 85 ? 'bg-error' : 'bg-primary'}`}></div>
            <div className={`h-4 w-1 ${cpuUsage > 85 ? 'bg-error' : 'bg-primary'}`}></div>
            <div className={`h-4 w-1 ${cpuUsage > 90 ? 'bg-error' : 'bg-outline-variant'}`}></div>
          </div>
        </div>
      </div>

      {/* Main Core: Traffic + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Traffic */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Live Network Traffic</h3>
              <p className="text-xs text-on-surface-variant/60 font-mono uppercase mt-1">
                Real-time Packet Inspection: 1,240 packets/sec
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary-container/10 border border-primary/20 rounded text-[10px] font-bold text-primary font-mono">
                INGRESS SECURE
              </span>
              <button
                onClick={handleSimulateAttack}
                className="px-3 py-1 bg-error/10 hover:bg-error/20 border border-error/30 rounded text-[10px] font-bold text-error font-mono transition-all active:scale-95"
              >
                TEST FLOOD
              </button>
            </div>
          </div>

          {/* SVG Animated Graph */}
          <div className="relative h-48 w-full bg-black/20 rounded-lg p-2 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trafficGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="1000" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Area path */}
              <path
                d={`M 0 160 
                    Q 100 ${120 + Math.sin(trafficOffset / 10) * 15}, 200 ${90 + Math.cos(trafficOffset / 8) * 10}
                    T 400 ${140 + Math.sin(trafficOffset / 5) * 20}
                    T 600 ${60 + Math.cos(trafficOffset / 12) * 25}
                    T 800 ${110 + Math.sin(trafficOffset / 15) * 10}
                    T 1000 ${70 + Math.cos(trafficOffset / 20) * 12} 
                    L 1000 200 L 0 200 Z`}
                fill="url(#trafficGrad)"
              />

              {/* Line path */}
              <path
                d={`M 0 160 
                    Q 100 ${120 + Math.sin(trafficOffset / 10) * 15}, 200 ${90 + Math.cos(trafficOffset / 8) * 10}
                    T 400 ${140 + Math.sin(trafficOffset / 5) * 20}
                    T 600 ${60 + Math.cos(trafficOffset / 12) * 25}
                    T 800 ${110 + Math.sin(trafficOffset / 15) * 10}
                    T 1000 ${70 + Math.cos(trafficOffset / 20) * 12}`}
                fill="none"
                stroke="#ffb4ab"
                strokeWidth="3"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Float values */}
            <div className="absolute top-2 left-2 bg-surface-container-low/80 px-2 py-0.5 rounded text-[10px] font-mono border border-outline-variant/20">
              Active Stream Peak: {cpuUsage > 85 ? '4.8 Gbps' : '2.1 Gbps'}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-outline-variant/10">
            <div>
              <p className="text-[10px] font-mono text-on-surface-variant font-bold uppercase">Peak Load</p>
              <p className="font-mono text-sm font-semibold">{cpuUsage > 85 ? '5.4 Gbps' : '4.2 Gbps'}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-on-surface-variant font-bold uppercase">Active IPs</p>
              <p className="font-mono text-sm font-semibold">1,024 Nodes</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-on-surface-variant font-bold uppercase">Drop Rate</p>
              <p className="font-mono text-sm text-error font-semibold">0.02%</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-on-surface-variant font-bold uppercase">Mitigations</p>
              <p className="font-mono text-sm text-secondary font-semibold">Active Rules</p>
            </div>
          </div>
        </div>

        {/* Alert Summary Feed */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider">
                Recent Threat Events
              </h3>
              <ShieldAlert className="w-4 h-4 text-on-surface-variant" />
            </div>

            <div className="space-y-3">
              {/* Incident 1 */}
              <div className="p-3 bg-surface-container rounded-lg border-l-4 border-error group cursor-pointer hover:bg-surface-container-high transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="px-1.5 py-0.5 bg-error/10 text-error text-[9px] font-mono font-bold rounded">
                    CRITICAL
                  </span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60">2m ago</span>
                </div>
                <p className="text-xs font-bold text-on-surface leading-tight">SQL Injection in URL Param</p>
                <p className="text-[10px] text-on-surface-variant truncate mt-1 font-mono">
                  Origin: 192.168.1.104 (DB_PROD)
                </p>
              </div>

              {/* Incident 2 */}
              <div className="p-3 bg-surface-container rounded-lg border-l-4 border-tertiary group cursor-pointer hover:bg-surface-container-high transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="px-1.5 py-0.5 bg-tertiary/10 text-tertiary text-[9px] font-mono font-bold rounded">
                    HIGH
                  </span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60">14m ago</span>
                </div>
                <p className="text-xs font-bold text-on-surface leading-tight">Multiple Failed SSH Logins</p>
                <p className="text-[10px] text-on-surface-variant truncate mt-1 font-mono">
                  Origin: 45.23.11.89 (Auth_Srv)
                </p>
              </div>

              {/* Incident 3 */}
              <div className="p-3 bg-surface-container rounded-lg border-l-4 border-outline group cursor-pointer hover:bg-surface-container-high transition-all opacity-70">
                <div className="flex justify-between items-start mb-1">
                  <span className="px-1.5 py-0.5 bg-outline-variant/35 text-on-surface-variant text-[9px] font-mono font-bold rounded">
                    MEDIUM
                  </span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60">1h ago</span>
                </div>
                <p className="text-xs font-bold text-on-surface leading-tight">Increased SMB Scanning</p>
                <p className="text-[10px] text-on-surface-variant truncate mt-1 font-mono">
                  Origin: 10.0.4.55 (Internal_WS)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-on-surface-variant">Active Threat Level:</span>
              <span className="text-error font-bold uppercase">Elevated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Global Connections Map & Connection details */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary pulse-cyan"></span>
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider font-mono">
              Interactive Global Active Threat Map
            </h3>
          </div>
          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className="flex items-center gap-1.5 px-3 py-1 bg-surface-container hover:bg-surface-container-highest rounded text-xs font-mono text-on-surface-variant border border-outline-variant/20 transition-all active:scale-95"
          >
            <Play className={`w-3 h-3 ${simulationActive ? 'text-secondary-fixed-dim' : 'text-on-surface-variant'}`} />
            {simulationActive ? 'PAUSE MONITOR' : 'RESUME MONITOR'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 h-[400px]">
          {/* Map display */}
          <div className="lg:col-span-3 bg-surface-container-lowest/50 relative overflow-hidden flex items-center justify-center p-4">
            {/* Holographic dot background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#414754 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Holographic World Map Image (provided by mockup metadata) */}
            <div
              className="absolute inset-0 opacity-40 bg-contain bg-center bg-no-repeat pointer-events-none"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDumx8I0jVYAz4kAs1UbdA29HC8Py0cUZDxWFvpJ95zfTRIq0Mth9xmr-O7Wr7aKI_NVsoEzlYD965qIug5V6i6P0LbAowzcl5NANRbC3YDJ9Wk0z6-5CFe3gtKcPwlgQJC_Q4sQ14eVw4XZDx2Ied9sPZoFkHy9FWQdGLYoavs6CH8c8wcK4i4Z2IKtZ8OxvJD3hr8v0tRIrvPztUK8IdaS7XhPJr-D2KZgAL_vXbSWke8WAmlTbX1NeEYWArVXKO0L0tygkQ9p3w')`,
              }}
            />

            {/* Map node buttons and pings */}
            {nodes.map((node) => (
              <div
                key={node.id}
                style={{ left: node.x, top: node.y }}
                className="absolute flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              >
                {node.active && (
                  <div className="relative">
                    {node.ping && (
                      <span className="w-4 h-4 bg-error rounded-full animate-ping absolute -left-1 -top-1" />
                    )}
                    <span className="w-2.5 h-2.5 bg-error rounded-full block border border-black" />
                  </div>
                )}
                {!node.active && (
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full block border border-black group-hover:bg-primary transition-colors" />
                )}
                <div className="bg-surface-container/90 backdrop-blur-md px-2 py-1 rounded border border-outline-variant/30 text-[9px] font-mono whitespace-nowrap text-on-surface shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                  {node.label}
                </div>
              </div>
            ))}
          </div>

          {/* Connection active telemetry feed */}
          <div className="lg:col-span-2 overflow-y-auto custom-scrollbar border-l border-outline-variant/10 bg-surface-container-low/30">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant/15">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] text-on-surface-variant font-bold uppercase">
                    Source IP
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] text-on-surface-variant font-bold uppercase">
                    Protocol
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] text-on-surface-variant font-bold uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] text-on-surface-variant font-bold uppercase text-right">
                    Mitigate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {connections.map((conn, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-highest/20 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-on-surface font-medium">
                      {conn.ip}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-on-surface-variant">
                      {conn.protocol}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase border ${
                          conn.status === 'BLOCKED'
                            ? 'bg-error-container/20 border-error/20 text-error'
                            : conn.status === 'FILTERED'
                            ? 'bg-tertiary-container/10 border-tertiary/20 text-tertiary'
                            : 'bg-primary-container/10 border-primary/20 text-secondary-fixed-dim'
                        }`}
                      >
                        {conn.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {conn.status !== 'BLOCKED' ? (
                        <button
                          onClick={() => handleBlockIp(conn.ip)}
                          className="text-[10px] font-mono text-error border border-error/20 bg-error/5 hover:bg-error/10 px-2 py-0.5 rounded transition-all active:scale-95"
                        >
                          BLOCK
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono text-outline uppercase tracking-wider">
                          MUTED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Health dials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dial 1: System Health Monitor */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-bold text-on-surface font-mono uppercase tracking-widest mb-6">
            System Resource Health Monitor
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center flex flex-col items-center">
              <div className="relative inline-block">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    className="text-outline-variant/20"
                    cx="48"
                    cy="48"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <circle
                    className="text-primary transition-all duration-1000"
                    cx="48"
                    cy="48"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset={(251.2 * (100 - cpuUsage)) / 100}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-base font-bold text-primary">{cpuUsage}%</span>
                </div>
              </div>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant uppercase mt-3">
                CPU Core Load
              </p>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="relative inline-block">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    className="text-outline-variant/20"
                    cx="48"
                    cy="48"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <circle
                    className="text-secondary-fixed-dim transition-all duration-1000"
                    cx="48"
                    cy="48"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset={(251.2 * (100 - ramUsage)) / 100}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-base font-bold text-secondary-fixed-dim">{ramUsage}%</span>
                </div>
              </div>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant uppercase mt-3">
                RAM Commitment
              </p>
            </div>
          </div>
        </div>

        {/* Security Core Quick Diagnostics */}
        <div className="glass-card rounded-xl p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-on-surface font-mono uppercase tracking-widest mb-4">
            Security Core Diagnostics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-on-surface-variant">Vulnerability Scanner Status:</span>
              <span className="text-secondary-fixed-dim flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-secondary-fixed-dim" /> SECURE / COMPLETED
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-on-surface-variant">Sandbox Hypervisor Integrity:</span>
              <span className="text-secondary-fixed-dim flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-secondary-fixed-dim" /> VERIFIED (v12.4)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-on-surface-variant">Enterprise Active Honeypots:</span>
              <span className="text-primary flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-primary pulse-cyan"></span> 12 Nodes Online
              </span>
            </div>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 p-3 rounded-lg text-[10px] text-on-surface-variant font-mono mt-4 leading-relaxed">
            <span className="text-secondary font-bold">Pro-tip:</span> Switch to the <strong className="text-white">Threat Intelligence</strong> tab to customize filters, examine malicious payloads, or map ATT&CK tactics instantly.
          </div>
        </div>
      </div>
    </div>
  );
}
