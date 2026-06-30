import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import LiveMonitoringView from './components/LiveMonitoringView';
import AnalyticsView from './components/AnalyticsView';
import ThreatIntelView from './components/ThreatIntelView';
import ModelPerformanceView from './components/ModelPerformanceView';
import LogsView from './components/LogsView';
import SettingsView from './components/SettingsView';
import { TabType } from './types';
import { ShieldCheck, FileDown, Zap, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Dynamic headings depending on active tab
  const getHeaderDetails = (): { title: string; subtitle: string } => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Aegis SOC // Hub_Command_Primary', subtitle: 'Command Dashboard' };
      case 'live-monitoring':
        return { title: 'Aegis NIDS // Packet_Capture_Main', subtitle: 'Live Monitoring' };
      case 'analytics':
        return { title: 'Aegis SIEM // Trend_Correlator', subtitle: 'Threat Analytics' };
      case 'threat-intel':
        return { title: 'Aegis Intel // Mitre_Tactic_Matrix', subtitle: 'Threat Intelligence' };
      case 'model-performance':
        return { title: 'Aegis Heuristics // Evaluation_Suite', subtitle: 'Model Performance' };
      case 'logs':
        return { title: 'Aegis Forensics // Elastic_Ingest_Archive', subtitle: 'System Threat Logs' };
      case 'settings':
        return { title: 'Aegis Engine // Parameters_Config', subtitle: 'Global System Settings' };
      default:
        return { title: 'Aegis SOC', subtitle: '' };
    }
  };

  const { title, subtitle } = getHeaderDetails();

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportReport={handleExportReport}
      />

      {/* Main Container Wrapper */}
      <div className="pl-[260px] min-h-screen flex flex-col">
        {/* Persistent Top Navigation Bar */}
        <Header
          title={title}
          subtitle={subtitle}
          onSearch={(query) => setSearchQuery(query)}
          currentUserEmail="s.jenkins@aegis.io"
        />

        {/* View Contents Segment */}
        <main className="flex-1 px-8 pt-24 pb-8 max-w-7xl w-full mx-auto animate-fade-in">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'live-monitoring' && <LiveMonitoringView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'threat-intel' && <ThreatIntelView />}
          {activeTab === 'model-performance' && <ModelPerformanceView />}
          {activeTab === 'logs' && <LogsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Export Report High-Fidelity Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-card p-6 rounded-xl w-full max-w-lg border border-outline-variant/30 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/10 mb-4">
              <ShieldCheck className="w-6 h-6 text-primary animate-pulse" />
              <h3 className="font-bold text-on-surface text-base uppercase font-mono tracking-wider">
                Aegis SOC Report Compiler
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <p className="text-on-surface-variant leading-relaxed">
                You are about to compile and export a secure, cryptographic snapshot of active threat intelligence registers and validation evaluations.
              </p>

              <div className="bg-surface-container-lowest/80 p-4 rounded border border-outline-variant/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-outline uppercase">Active Incidents Blocked (24h):</span>
                  <span className="text-primary font-bold">12,482</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline uppercase">Ingress Subnets Audited:</span>
                  <span className="text-white font-semibold">10.0.4.0/24, 192.168.1.0/24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline uppercase">Model Classification Accuracy:</span>
                  <span className="text-secondary font-bold">99.82%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline uppercase">Compiler Format:</span>
                  <span className="text-white">PDF / SECURE_ZIP</span>
                </div>
              </div>

              <div className="p-3 bg-secondary-container/5 rounded-lg border border-secondary/10 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  <strong>Access Policy:</strong> Decrypted payloads will only be visible to authorised security analysts associated with <strong>s.jenkins@aegis.io</strong>.
                </p>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-container-highest uppercase text-[10px] tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Decryption pipeline started. SECURE_REPORT.pdf downloaded.');
                    setShowExportModal(false);
                  }}
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded uppercase text-[10px] tracking-wider flex items-center gap-2"
                >
                  <FileDown className="w-3.5 h-3.5" /> Compile & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
