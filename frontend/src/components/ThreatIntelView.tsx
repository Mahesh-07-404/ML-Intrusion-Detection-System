import React, { useState } from 'react';
import { Rss, Shield, AlertCircle, FileText, ChevronRight, CheckCircle2, UserCheck, Settings, RefreshCw, Zap } from 'lucide-react';
import { initialThreatFeed, mitreMatrixData, recommendedMitigations } from '../data/mockData';

interface TacticDetail {
  id: string;
  name: string;
  description: string;
  risk: 'CRITICAL RISK' | 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
  mitigations: string[];
}

export default function ThreatIntelView() {
  const [threatFeed, setThreatFeed] = useState(initialThreatFeed);
  const [mitreMatrix, setMitreMatrix] = useState(mitreMatrixData);
  const [mitigations, setMitigations] = useState(recommendedMitigations);

  // Technique detail pool to load when clicking MITRE grid cells
  const techniqueDetailsMap: Record<string, TacticDetail> = {
    'Drive-by Comp.': {
      id: 'T1189',
      name: 'Drive-by Compromise',
      description: 'Adversaries may gain access to systems by exploiting web browsers or plug-ins during web exploration. This involves hosting malicious code on legitimate websites or ad networks to compromise visitors silently.',
      risk: 'HIGH RISK',
      mitigations: ['Browser Sandboxing', 'Vulnerability scanning', 'Adblock extensions'],
    },
    'Exploit Public': {
      id: 'T1190',
      name: 'Exploit Public-Facing Application',
      description: 'Adversaries may attempt to exploit a weakness in an internet-facing computer or system (such as web server, API endpoint, or mail proxy) to gain access to corporate subnets.',
      risk: 'CRITICAL RISK',
      mitigations: ['Regular Patching', 'Web Application Firewall (WAF)', 'Network segmentation'],
    },
    'External Remote': {
      id: 'T1133',
      name: 'External Remote Services',
      description: 'Adversaries may leverage public-facing remote services like VPNs, RDP interfaces, or custom APIs to authenticate and gain access to internal domain controllers.',
      risk: 'CRITICAL RISK',
      mitigations: ['Multi-Factor Authentication (MFA)', 'Access audits', 'IP blocklists'],
    },
    'Phishing': {
      id: 'T1566.001',
      name: 'Spearphishing Attachment',
      description: 'Adversaries may send spearphishing messages with a malicious attachment to an individual or group within an organization. This is a common method of gaining initial access. The attachment is often a weaponized document (e.g., Office, PDF) or a script designed to execute shellcode or download a second-stage payload.',
      risk: 'CRITICAL RISK',
      mitigations: ['User Training', 'Antivirus scanning', 'Email Gateway Filtering'],
    },
    'Account Manip.': {
      id: 'T1098',
      name: 'Account Manipulation',
      description: 'Adversaries may manipulate system or active directory credentials to maintain access to target domains. This includes adding users to administrator groups or altering privileges.',
      risk: 'CRITICAL RISK',
      mitigations: ['Credential audits', 'Access control monitoring', 'Group policy rules'],
    },
    'Command & Script': {
      id: 'T1059',
      name: 'Command and Scripting Interpreter',
      description: 'Adversaries may abuse scripting frameworks like PowerShell, Bash, Python, or cmd.exe to execute commands, perform reconnaissance, or deliver malicious payloads.',
      risk: 'HIGH RISK',
      mitigations: ['Command Logging', 'PowerShell Constrained Language Mode', 'AppLocker policy'],
    },
    'Create Account': {
      id: 'T1136',
      name: 'Create Account (Local/Domain)',
      description: 'Adversaries may create local or domain user accounts to maintain access to systems. This provides redundancy in case main backdoors are detected or patched.',
      risk: 'CRITICAL RISK',
      mitigations: ['Account Auditing', 'IAM Principle of Least Privilege', 'MFA rules'],
    },
    'Process Disc.': {
      id: 'T1057',
      name: 'Process Discovery',
      description: 'Adversaries may attempt to gather information about active processes on systems to identify defensive software, active connections, or target client applications.',
      risk: 'LOW RISK',
      mitigations: ['Endpoint Detection (EDR)', 'Log process starts', 'Audit local access'],
    },
    'Application Layer': {
      id: 'T1071',
      name: 'Application Layer Protocol',
      description: 'Adversaries may communicate using application layer protocols (like HTTP, HTTPS, DNS, or custom web APIs) to bypass firewalls and disguise command and control data as benign traffic.',
      risk: 'HIGH RISK',
      mitigations: ['Network Traffic Analysis', 'TLS Inspection', 'Domain name profiling'],
    },
  };

  const defaultDetail: TacticDetail = {
    id: 'T1566.001',
    name: 'Spearphishing Attachment',
    description: 'Adversaries may send spearphishing messages with a malicious attachment to an individual or group within an organization. This is a common method of gaining initial access. The attachment is often a weaponized document (e.g., Office, PDF) or a script designed to execute shellcode or download a second-stage payload.',
    risk: 'CRITICAL RISK',
    mitigations: ['User Training', 'Antivirus scanning', 'Email Gateway Filtering'],
  };

  const [activeAnalysis, setActiveAnalysis] = useState<TacticDetail>(defaultDetail);
  const [selectedCell, setSelectedCell] = useState<string>('Phishing');
  const [mitigationStatus, setMitigationStatus] = useState<string | null>(null);

  const handleCellClick = (name: string) => {
    setSelectedCell(name);
    if (techniqueDetailsMap[name]) {
      setActiveAnalysis(techniqueDetailsMap[name]);
    } else {
      // Fallback placeholder
      setActiveAnalysis({
        id: 'T-UNKNOWN',
        name: name,
        description: `Adversaries may use the technique "${name}" to advance their attack objectives. Detailed behavior profiles are updated continuously in our Global threat database.`,
        risk: 'HIGH RISK',
        mitigations: ['Implement EDR logging', 'Review host logs', 'Enforce principal of least privilege'],
      });
    }
  };

  const deployMitigationRules = () => {
    setMitigationStatus('DEPLOYED');
    setTimeout(() => {
      setMitigationStatus(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner for deployed mitigation */}
      {mitigationStatus && (
        <div className="bg-secondary-container/20 border border-secondary-container/50 text-secondary-fixed-dim px-4 py-3 rounded-lg flex items-center gap-2 text-xs font-mono animate-fade-in shadow-lg">
          <Zap className="w-4 h-4 text-secondary-container animate-bounce" />
          <span>Mitigation Pipeline triggered: Automated AI firewall block rules successfully distributed to enterprise nodes!</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Threat Feed & Integration Cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Threat Feed Card */}
          <div className="glass-card p-6 rounded-xl flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-primary font-mono uppercase tracking-wider flex items-center gap-2">
                <Rss className="w-4 h-4" /> Global Threat Feed
              </h2>
              <span className="pulse-cyan w-2 h-2 rounded-full bg-secondary"></span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {threatFeed.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 bg-surface-container/40 border-l-4 rounded-r-lg transition-colors ${
                    item.severity === 'CRITICAL'
                      ? 'border-error luminous-red'
                      : item.severity === 'HIGH'
                      ? 'border-tertiary'
                      : item.severity === 'INFO'
                      ? 'border-secondary'
                      : 'border-outline-variant'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`font-mono font-bold text-[10px] ${
                        item.severity === 'CRITICAL'
                          ? 'text-error'
                          : item.severity === 'HIGH'
                          ? 'text-tertiary'
                          : item.severity === 'INFO'
                          ? 'text-secondary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {item.severity} // {item.actor}
                    </span>
                    <span className="font-mono text-[9px] text-on-surface-variant/60">{item.time}</span>
                  </div>
                  <h3 className="font-sans text-xs font-semibold text-on-surface leading-snug">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex gap-2">
                    {item.cve && (
                      <span className="px-1.5 py-0.5 bg-error/10 text-error text-[9px] font-mono rounded">
                        {item.cve}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 bg-outline-variant/20 text-on-surface-variant text-[9px] font-mono rounded">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration widgets */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl hover:border-primary/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="font-mono font-bold text-[10px] text-on-surface uppercase tracking-wider">
                  AlienVault OTX
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">1,240 threat pulses today</p>
              <div className="mt-2 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3"></div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl hover:border-secondary/40 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                  <Shield className="w-4 h-4 text-error" />
                </div>
                <span className="font-mono font-bold text-[10px] text-on-surface uppercase tracking-wider">
                  VirusTotal API
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Connected / Secure state</p>
              <div className="mt-2 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: MITRE Matrix Grid */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-primary font-mono uppercase tracking-wider">
                  MITRE ATT&CK® Matrix Mapping
                </h2>
                <p className="text-on-surface-variant text-xs mt-1">
                  Click any active tactic tile to analyze specific attack vector mitigations.
                </p>
              </div>
            </div>

            {/* Interactive Grid Columns */}
            <div className="overflow-x-auto custom-scrollbar">
              <div className="flex gap-2 min-w-[700px] h-[340px]">
                {mitreMatrix.map((col) => (
                  <div key={col.title} className="flex-1 flex flex-col gap-2">
                    <div className={`p-2 bg-surface-container-high border-b ${col.borderColorClass} text-center rounded-t`}>
                      <span className={`font-mono text-[9px] font-bold ${col.textColorClass}`}>
                        {col.title}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                      {col.techniques.map((tech) => {
                        const isSelected = selectedCell === tech.name;
                        return (
                          <div
                            key={tech.name}
                            onClick={() => handleCellClick(tech.name)}
                            className={`p-2 rounded text-[10px] font-mono cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-primary/20 border border-primary text-primary font-bold shadow-lg scale-[1.02]'
                                : tech.activeState === 'full'
                                ? 'bg-error-container/20 border border-error/20 text-error'
                                : tech.activeState === 'semi'
                                ? 'bg-tertiary-container/10 border border-tertiary/20 text-tertiary'
                                : 'bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant/40 hover:border-outline hover:text-on-surface'
                            }`}
                          >
                            {tech.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Mitigation View & Analysis details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Threat Details */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-tertiary" /> Active Tactic Behavior Profile
                </h3>

                <div className="bg-surface-container-lowest/50 p-4 rounded border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-tertiary uppercase font-bold">
                      Tactic ID: {activeAnalysis.id}
                    </span>
                    <span className="px-2 py-0.5 bg-error/15 text-error text-[9px] font-mono font-bold rounded">
                      {activeAnalysis.risk}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-primary mb-2">
                    {activeAnalysis.name}
                  </h4>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed select-text font-sans">
                    {activeAnalysis.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => alert(`Pulling raw CVE/TTP payload registers from Mitre for: ${activeAnalysis.name}`)}
                  className="flex-1 py-1.5 border border-outline-variant/40 hover:bg-surface-container-highest rounded font-mono text-[10px] text-on-surface uppercase tracking-wide transition-colors"
                >
                  View Mitre Data
                </button>
                <button
                  onClick={() => alert(`Correlating raw log indexes for tactic: ${activeAnalysis.id}`)}
                  className="flex-1 py-1.5 border border-outline-variant/40 hover:bg-surface-container-highest rounded font-mono text-[10px] text-on-surface uppercase tracking-wide transition-colors"
                >
                  Correlate Logs
                </button>
              </div>
            </div>

            {/* Recommended Mitigations */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-secondary" /> Mitigations and Protections
                </h3>

                <div className="space-y-4 flex-1">
                  {mitigations.map((mit) => (
                    <div key={mit.id} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="font-sans font-bold text-xs text-on-surface">{mit.title}</p>
                        <p className="text-on-surface-variant text-[11px] leading-relaxed mt-0.5">
                          {mit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={deployMitigationRules}
                className="mt-4 w-full py-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-mono text-xs uppercase font-bold tracking-wider rounded transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Deploy AI Mitigation Rules
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
