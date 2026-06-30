import React, { useState } from 'react';
import { Download, Code, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, AlertCircle } from 'lucide-react';
import { initialLogs } from '../data/mockData';
import { LogItem } from '../types';

export default function LogsView() {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 24 Hours');
  const [currentPage, setCurrentPage] = useState(1);
  const [inspectingLog, setInspectingLog] = useState<LogItem | null>(initialLogs[0]);

  // Unique lists for filtering dropdowns
  const severities = ['All', 'CRITICAL', 'HIGH', 'WARNING', 'INFO', 'DEBUG'];
  const eventTypes = [
    'All',
    'SQL Injection Attempt',
    'Auth Failure',
    'Lateral Movement',
    'System Update',
    'Resource Usage',
    'Exfiltration Alert',
    'Ransomware Execution',
  ];

  // Perform filtering
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sourceIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
    const matchesEventType = selectedEventType === 'All' || log.eventType === selectedEventType;

    return matchesSearch && matchesSeverity && matchesEventType;
  });

  const handleExportCSV = () => {
    alert('Generating CSV report with current filtered log registers. Download stream started.');
  };

  const handleExportJSON = () => {
    alert('Compiling JSON log telemetry. Direct secure download stream configured.');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Segment */}
      <section className="glass-card p-6 rounded-xl flex flex-col gap-4 bg-surface-container-low/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Date Range
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/30 text-xs px-3 py-2 rounded focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom Range</option>
            </select>
          </div>

          {/* Severity filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Severity Level
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container-lowest border border-outline-variant/30 text-xs px-3 py-2 rounded focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
            >
              {severities.map((sev) => (
                <option key={sev} value={sev}>
                  {sev === 'All' ? 'All Severities' : sev}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type filter */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Event Class
            </label>
            <select
              value={selectedEventType}
              onChange={(e) => {
                setSelectedEventType(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container-lowest border border-outline-variant/30 text-xs px-3 py-2 rounded focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
            >
              {eventTypes.map((evt) => (
                <option key={evt} value={evt}>
                  {evt === 'All' ? 'All Events' : evt}
                </option>
              ))}
            </select>
          </div>

          {/* Text query search */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
              Payload Regex Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="e.g. UNION, admin, 10.0.x"
              className="bg-surface-container-lowest border border-outline-variant/30 text-xs px-3 py-2 rounded focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
            />
          </div>
        </div>

        {/* Action button triggers */}
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
          <div className="text-xs font-mono text-outline">
            Filtered logs count:{' '}
            <strong className="text-white">{filteredLogs.length} matching rows</strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-all text-xs rounded font-mono flex items-center gap-2 bg-surface-container-lowest"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-all text-xs rounded font-mono flex items-center gap-2 bg-surface-container-lowest"
            >
              <Code className="w-3.5 h-3.5" /> Export JSON
            </button>
          </div>
        </div>
      </section>

      {/* Main Table & Forensic Inspector Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table layout */}
        <div className="lg:col-span-8 glass-card rounded-xl flex flex-col h-[520px] justify-between overflow-hidden">
          <div className="overflow-y-auto custom-scrollbar flex-1 font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high/60 text-[10px] text-outline uppercase tracking-wider border-b border-outline-variant/25 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Event Type</th>
                  <th className="px-4 py-3">Source IP</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-on-surface-variant/50">
                      No matching threat log records identified.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isInspecting = inspectingLog?.id === log.id;
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setInspectingLog(log)}
                        className={`hover:bg-surface-container-highest/20 cursor-pointer transition-colors ${
                          isInspecting ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                              log.severity === 'CRITICAL'
                                ? 'bg-error-container text-error shadow-[0_0_10px_rgba(255,180,171,0.2)]'
                                : log.severity === 'HIGH'
                                ? 'bg-error-container/60 text-error'
                                : log.severity === 'WARNING'
                                ? 'bg-tertiary-container text-white'
                                : log.severity === 'INFO'
                                ? 'border border-secondary/40 text-secondary'
                                : 'border border-outline-variant/50 text-outline'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-on-surface font-medium truncate max-w-[120px]">
                          {log.eventType}
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant font-semibold">
                          {log.sourceIp}
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">
                          {log.target}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 text-primary hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
            <div className="text-xs text-on-surface-variant/60">
              Showing <span className="text-on-surface font-bold">1-{filteredLogs.length}</span> of{' '}
              <span className="text-on-surface font-bold">1,249,502</span> entries
            </div>

            <div className="flex items-center gap-1 font-mono">
              <button className="p-1 hover:bg-surface-container-highest rounded text-outline-variant disabled:opacity-30">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-surface-container-highest rounded text-outline-variant disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center px-4 gap-2">
                <button className="w-7 h-7 flex items-center justify-center rounded bg-primary text-on-primary text-xs font-bold">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant text-xs">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant text-xs">
                  3
                </button>
                <span className="text-outline-variant text-[10px]">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant text-xs">
                  24991
                </button>
              </div>
              <button className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Log Payload Inspector */}
        <div className="lg:col-span-4 glass-card p-5 rounded-xl flex flex-col justify-between h-[520px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/10">
              <AlertCircle className="w-4 h-4 text-primary animate-pulse" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-on-surface">
                Forensic Payload Decoder
              </h3>
            </div>

            {inspectingLog ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-surface-container-lowest/80 p-3 rounded border border-outline-variant/20 space-y-1">
                  <p className="text-outline text-[9px] uppercase font-bold">Severity Rating:</p>
                  <p
                    className={`font-bold ${
                      inspectingLog.severity === 'CRITICAL' ? 'text-error' : 'text-primary'
                    }`}
                  >
                    {inspectingLog.severity}
                  </p>
                  <p className="text-outline text-[9px] uppercase font-bold mt-2">Captured timestamp:</p>
                  <p className="text-white font-semibold">{inspectingLog.timestamp}</p>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-outline uppercase font-bold">Attack signature Class:</span>
                    <p className="text-on-surface font-semibold bg-surface-container-low p-2 rounded border border-outline-variant/15 mt-1">
                      {inspectingLog.eventType}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-outline uppercase font-bold">Target endpoint node:</span>
                    <p className="text-on-surface font-semibold bg-surface-container-low p-2 rounded border border-outline-variant/15 mt-1">
                      {inspectingLog.target}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-outline uppercase font-bold">Raw payload decode:</span>
                  <div className="bg-surface-container-lowest p-3 rounded leading-relaxed text-secondary-fixed-dim border border-outline-variant/15 font-semibold text-[11px] select-all max-h-44 overflow-y-auto custom-scrollbar break-words mt-1">
                    {inspectingLog.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-on-surface-variant/50">
                Click any log entry to decode detailed firewall payload strings.
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-outline-variant/80 border-t border-outline-variant/10 pt-3">
            <span>Enterprise Nodes reporting: 12. Host: Cluster US-EAST-1.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
