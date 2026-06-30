import { TabType } from '../types';
import {
  LayoutDashboard,
  Activity,
  LineChart,
  ShieldAlert,
  BrainCircuit,
  FileText,
  Settings as SettingsIcon,
  Clock,
  Terminal,
  FileDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onExportReport: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onExportReport }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-monitoring' as TabType, label: 'Live Monitoring', icon: Activity },
    { id: 'analytics' as TabType, label: 'Analytics', icon: LineChart },
    { id: 'threat-intel' as TabType, label: 'Threat Intelligence', icon: ShieldAlert },
    { id: 'model-performance' as TabType, label: 'Model Performance', icon: BrainCircuit },
    { id: 'logs' as TabType, label: 'Logs', icon: FileText },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/10 flex flex-col py-6 z-50">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <h1 className="font-sans text-[24px] font-bold text-primary tracking-tight">
          Aegis SOC
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-secondary pulse-cyan"></span>
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            System Status: Active
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? 'text-primary bg-primary-container/10 border-r-2 border-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest/50 hover:text-on-surface'
              }`}
            >
              <IconComponent className={`w-[20px] h-[20px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
              <span className="text-sm font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="mt-auto px-6 pt-6 border-t border-outline-variant/10">
        <button
          onClick={onExportReport}
          className="w-full py-2 bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-mono text-[12px] uppercase tracking-wider rounded font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <FileDown className="w-4 h-4" />
          Export Report
        </button>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-on-surface-variant/60 font-mono text-[10px]">
            <Clock className="w-3.5 h-3.5" />
            <span>System Uptime: 99.9%</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant/60 font-mono text-[10px]">
            <Terminal className="w-3.5 h-3.5" />
            <span>v2.4.0-prod</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
