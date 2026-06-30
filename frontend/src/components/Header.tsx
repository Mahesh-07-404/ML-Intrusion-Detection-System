import React, { useState } from 'react';
import { Search, Bell, Shield, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch: (query: string) => void;
  currentUserEmail: string;
}

export default function Header({ title, subtitle, onSearch, currentUserEmail }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: '[CRITICAL] SQL Injection Attempt Blocked on DB_PROD_01', time: '2m ago', active: true },
    { id: 2, text: '[HIGH] Port Scanning detected from Tor Node range', time: '14m ago', active: true },
    { id: 3, text: '[INFO] Daily vulnerability scan completed with 0 high alerts', time: '1h ago', active: false },
    { id: 4, text: '[LOW] CPU load spiked above 90% on worker microservice-5', time: '3h ago', active: false },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 z-40">
      {/* Title / Subtitle segment */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] tracking-widest text-on-surface-variant uppercase">
          {title}
        </span>
        {subtitle && (
          <>
            <div className="h-4 w-px bg-outline-variant/30" />
            <h2 className="font-sans text-sm font-semibold text-primary">
              {subtitle}
            </h2>
          </>
        )}
      </div>

      {/* Action panel (Search, Notifications, Profile) */}
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-full pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all placeholder:text-outline-variant/50"
            placeholder="Search parameters or IPs..."
          />
          <Search className="w-3.5 h-3.5 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
        </div>

        {/* Bell Alert Notification Panel */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-on-surface-variant hover:text-primary transition-colors relative p-1.5 rounded-full hover:bg-surface-container-highest/20"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-1.5 border-b border-outline-variant/10 flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono">
                  Active Security Alerts
                </span>
                <span className="text-[9px] text-primary px-1.5 py-0.5 bg-primary-container/10 rounded font-bold uppercase font-mono">
                  Live Feed
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 hover:bg-surface-container-highest/40 border-b border-outline-variant/5 transition-colors cursor-pointer"
                  >
                    <p className={`text-xs leading-relaxed ${notif.active ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                      {notif.text}
                    </p>
                    <span className="text-[10px] text-outline font-mono block mt-1">
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-outline-variant/10 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Close Panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analyst Profile Block */}
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface leading-tight">L. VANCE</p>
            <p className="text-[10px] text-primary font-mono tracking-tighter uppercase font-semibold">
              Sr. Analyst
            </p>
          </div>
          <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeYLSmL6GXOXP7AnP2wLeL8b7Pvo0_QjnMJYM6WSvmaIGDaLlQwT-9rdqrAA23gphGRDnjMG8_E0k1RLm-8c821AN3gCwVk5Y4PDxVZMvIjEwvpcQrpLXe6lE6N58i2_o3uBtOqRGsAoMLDZZ0e3XpdLwCH8IJ65LzevDqIhtnBUamHnnHcMnQj79IRUOFRbQhZXVZwO8u0Lq43VAHniL4dttvJmdOHC-pST-_0gnb8mGJAFWMpNexYjI2kZo9dEfDy9ZEwPAREFQ"
              alt="Security Analyst"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
