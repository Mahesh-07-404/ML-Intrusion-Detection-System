import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, Eye, HelpCircle, Palette, Group, UserPlus, Trash, Copy, Check } from 'lucide-react';
import { initialUsers } from '../data/mockData';
import { UserItem } from '../types';

export default function SettingsView() {
  const [model, setModel] = useState('Random Forest (Optimized)');
  const [sensitivity, setSensitivity] = useState(84);
  const [webhookUrl, setWebhookUrl] = useState('https://siem-relay.internal.aegis.io/v1/alerts');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // User management state
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('L2_Analyst');

  // Accessibility flags
  const [compactMode, setCompactMode] = useState(true);
  const [auditoryNotifications, setAuditoryNotifications] = useState(false);
  const [activeTheme, setActiveTheme] = useState<'dark' | 'standard' | 'contrast'>('dark');

  const handleCopyKey = (keyName: string) => {
    setCopiedKey(keyName);
    navigator.clipboard.writeText(keyName === 'prod' ? '•••••••••••••7f8w' : '•••••••••••••a2n9');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: UserItem = {
      id: `u${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      access: newUserRole === 'Super_Admin' ? 'Full System Access' : newUserRole === 'L2_Analyst' ? 'Read/Write Analytics' : 'Log Visualization Only',
      lastActivity: 'Just created',
      sessionIp: '192.168.1.' + (Math.floor(Math.random() * 200) + 10),
      active: true,
    };

    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleSaveEnvironment = () => {
    alert('Security Environment settings distributed to network nodes successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10">
        <div>
          <h3 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider">
            Aegis SOC Configuration
          </h3>
          <p className="text-xs text-on-surface-variant/60 mt-1">
            Configure core heuristic models, API integration vectors, and administrative access controls.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Changes discarded')}
            className="px-4 py-1.5 border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest rounded text-xs font-mono uppercase tracking-wider transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleSaveEnvironment}
            className="px-5 py-1.5 bg-primary-container text-on-primary-container font-mono font-bold rounded text-xs uppercase tracking-wider transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary-container/20"
          >
            Save Environment
          </button>
        </div>
      </div>

      {/* Bento Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Detection Engine setting panel */}
        <div className="md:col-span-4 glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-on-surface text-sm uppercase font-mono tracking-wider">
              Detection Engine
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">
                Primary Heuristic Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all text-on-surface"
              >
                <option>Random Forest (Optimized)</option>
                <option>Recurrent Neural Network (RNN)</option>
                <option>Isolation Forest (Anomaly-First)</option>
                <option>XGBoost (Legacy Support)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <label className="font-mono text-on-surface-variant uppercase font-bold">
                  Sensitivity Threshold
                </label>
                <span className="text-secondary font-mono font-semibold">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="p-3 bg-secondary-container/5 rounded-lg border border-secondary/10">
              <p className="text-[10px] text-on-surface-variant leading-relaxed font-mono">
                <span className="text-secondary font-bold">Heuristic Note:</span> Random Forest mode reduces false positive alert noise by 24% on typical ingress subnets.
              </p>
            </div>
          </div>
        </div>

        {/* API & Webhook panel */}
        <div className="md:col-span-8 glass-card p-6 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-on-surface text-sm uppercase font-mono tracking-wider">
                API & Integration Endpoints
              </h3>
            </div>
            <button
              onClick={() => alert('New key token successfully generated! Please store securely.')}
              className="text-primary font-mono text-[10px] uppercase font-bold hover:underline flex items-center gap-1"
            >
              + Create Key
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Token 1 */}
              <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[11px] text-on-surface font-semibold">Production_Main_V2</span>
                  <span className="text-secondary text-[9px] font-mono uppercase font-bold">Verified</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded px-2.5 py-1.5 mb-2 border border-outline-variant/10">
                  <span className="text-on-surface-variant font-mono text-[11px]">•••••••••••••7f8w</span>
                  <button
                    onClick={() => handleCopyKey('prod')}
                    className="ml-auto text-on-surface-variant hover:text-primary transition-colors p-1"
                    title="Copy Key Token"
                  >
                    {copiedKey === 'prod' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-mono">
                  <span>Last used: 4m ago</span>
                  <span className="text-secondary">Active State</span>
                </div>
              </div>

              {/* Token 2 */}
              <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[11px] text-on-surface font-semibold">Dev_Sandbox_Internal</span>
                  <span className="text-on-surface-variant/60 text-[9px] font-mono uppercase font-bold">Idle</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 rounded px-2.5 py-1.5 mb-2 border border-outline-variant/10">
                  <span className="text-on-surface-variant font-mono text-[11px]">•••••••••••••a2n9</span>
                  <button
                    onClick={() => handleCopyKey('dev')}
                    className="ml-auto text-on-surface-variant hover:text-primary transition-colors p-1"
                    title="Copy Key Token"
                  >
                    {copiedKey === 'dev' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant/70 font-mono">
                  <span>Last used: 2d ago</span>
                  <span className="text-outline-variant">Passive State</span>
                </div>
              </div>
            </div>

            {/* Webhook Callback */}
            <div className="space-y-2 mt-2">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase font-bold block">
                Webhook Callback URL (Alert Dispatcher)
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 px-3 font-mono text-xs focus:ring-1 focus:ring-primary text-on-surface focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Interface & Accessibility panel */}
        <div className="md:col-span-12 glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4 mb-6">
            <Palette className="w-5 h-5 text-tertiary" />
            <h3 className="font-bold text-on-surface text-sm uppercase font-mono tracking-wider">
              Interface & Accessibility
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Visual Theme Selection */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Visual HUD Theme</h4>
              <div className="flex gap-2 p-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl">
                <button
                  onClick={() => setActiveTheme('dark')}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-center transition-all ${
                    activeTheme === 'dark'
                      ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-md'
                      : 'border-transparent text-on-surface-variant/80 hover:bg-surface-container-highest/50'
                  }`}
                >
                  <span className="text-[10px] font-mono">Dark (HUD)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTheme('standard');
                    alert('Standard light theme toggled. HUD defaults applied.');
                  }}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-center transition-all ${
                    activeTheme === 'standard'
                      ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-md'
                      : 'border-transparent text-on-surface-variant/80 hover:bg-surface-container-highest/50'
                  }`}
                >
                  <span className="text-[10px] font-mono">Standard</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTheme('contrast');
                    alert('High contrast eye-safe mode selected.');
                  }}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-center transition-all ${
                    activeTheme === 'contrast'
                      ? 'bg-primary-container/20 border-primary text-primary font-bold shadow-md'
                      : 'border-transparent text-on-surface-variant/80 hover:bg-surface-container-highest/50'
                  }`}
                >
                  <span className="text-[10px] font-mono">Contrast</span>
                </button>
              </div>
            </div>

            {/* Data Density toggling */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Data Density</h4>
              <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <span className="text-xs text-on-surface font-semibold font-mono">Compact View Mode</span>
                <button
                  onClick={() => setCompactMode(!compactMode)}
                  className={`w-10 h-5 rounded-full relative transition-all ${
                    compactMode ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full transition-all ${
                      compactMode ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Alert soundscape toggle */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Alert Soundscape</h4>
              <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <span className="text-xs text-on-surface font-semibold font-mono">Auditory Notifications</span>
                <button
                  onClick={() => setAuditoryNotifications(!auditoryNotifications)}
                  className={`w-10 h-5 rounded-full relative transition-all ${
                    auditoryNotifications ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full transition-all ${
                      auditoryNotifications ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Administration Management panel */}
        <div className="md:col-span-12 glass-card rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/30">
            <div className="flex items-center gap-3">
              <Group className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-on-surface text-sm uppercase font-mono tracking-wider">
                Administrative Management
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => alert('Permissions batch audit scheduled successfully')}
                className="px-3 py-1.5 bg-surface-container-highest text-on-surface rounded font-mono text-[10px] hover:brightness-110 transition-all uppercase tracking-wider"
              >
                Bulk Audit
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3 py-1.5 bg-primary-container text-on-primary-container rounded font-bold font-mono text-[10px] hover:brightness-110 transition-all flex items-center gap-1 uppercase tracking-wider active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" /> + New User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-surface-container-low text-[10px] text-outline uppercase tracking-wider border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Primary Access</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4">Session Endpoint</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-on-surface font-semibold text-xs">{user.name}</p>
                          <p className="text-[11px] text-on-surface-variant font-mono mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-secondary-container/10 border border-secondary/20 text-secondary text-[9px] font-mono font-bold uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-on-surface-variant font-mono text-[11px]">{user.access}</td>
                    <td className="px-6 py-3.5 text-on-surface-variant/80 font-mono text-[11px]">{user.lastActivity}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        {user.active ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-cyan" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                        )}
                        <span className="text-on-surface font-mono text-[11px]">{user.sessionIp}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {user.email !== 's.jenkins@aegis.io' ? (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-on-surface-variant hover:text-error transition-colors"
                          title="Revoke User Access"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono text-outline uppercase">Owner</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-card p-6 rounded-xl w-full max-w-md border border-outline-variant/30 relative">
            <h3 className="text-sm font-bold font-mono text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-2">
              Register New Analyst User
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-outline uppercase text-[9px] font-bold block">User Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Vance Carter"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-outline uppercase text-[9px] font-bold block">User Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. v.carter@aegis.io"
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-outline uppercase text-[9px] font-bold block">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Super_Admin">Super Admin</option>
                  <option value="L2_Analyst">L2 Analyst</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 rounded text-on-surface-variant hover:bg-surface-container-highest uppercase text-[10px] tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-on-primary font-bold rounded uppercase text-[10px] tracking-wider"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
