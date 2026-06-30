import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu, Database, Play, Pause, RefreshCw, Terminal, Search, Info } from 'lucide-react';

interface CapturedPacket {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'TLS 1.3' | 'SSH';
  length: number;
  info: string;
  hex: string;
  ascii: string;
}

export default function LiveMonitoringView() {
  const [isCapturing, setIsCapturing] = useState(true);
  const [filterProto, setFilterProto] = useState<string>('ALL');
  const [packets, setPackets] = useState<CapturedPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<CapturedPacket | null>(null);
  const [packetsCapturedCount, setPacketsCapturedCount] = useState(1420912);
  const [packetsDroppedCount, setPacketsDroppedCount] = useState(24);

  const initialPacketPool: CapturedPacket[] = [
    {
      id: 'PKT-9921',
      timestamp: '14:03:01.0912',
      source: '192.168.1.104',
      destination: '10.0.0.4',
      protocol: 'TCP',
      length: 64,
      info: 'Flags [S], Seq=0, Win=64240, Len=0',
      hex: '45 00 00 28 d5 fc 40 00 40 06 db b2 c0 a8 01 68 0a 00 00 04 04 01 00 50 00 00 00 00 00 00 00 00 50 02 fa f0 b2 a4 00 00',
      ascii: 'E..(..@.@......h...p.....P..........P.....',
    },
    {
      id: 'PKT-9922',
      timestamp: '14:03:01.1215',
      source: '45.23.11.89',
      destination: '172.16.2.22',
      protocol: 'SSH',
      length: 1240,
      info: 'Client: Key Exchange Init (KEX)',
      hex: '00 00 04 d8 06 14 00 00 00 00 00 00 00 00 00 00 a3 a8 45 42 d8 99 c2 a1 d9 d0 00 c1 f2 44 df 12 aa b2 d4 d5 f0 f1 f2 00',
      ascii: '......EB.......D..........................',
    },
    {
      id: 'PKT-9923',
      timestamp: '14:03:02.0041',
      source: '10.0.4.55',
      destination: '8.8.8.8',
      protocol: 'UDP',
      length: 82,
      info: 'Standard query 0x1f22 A internal-license-srv.aegis.io',
      hex: '45 00 00 52 41 23 00 00 40 11 b2 a1 0a 00 04 37 08 08 08 08 00 35 00 35 00 3e b1 a2 1f 22 01 00 00 01 00 00 00 00 00 00',
      ascii: 'E..RA#..@......7......5.5.>.....".........',
    },
    {
      id: 'PKT-9924',
      timestamp: '14:03:02.1451',
      source: '172.16.254.1',
      destination: '192.168.1.5',
      protocol: 'TLS 1.3',
      length: 512,
      info: 'Application Data Protocol Stream [Encrypted]',
      hex: '17 03 03 02 00 a1 f2 d3 42 d1 e1 fa d3 49 b3 d4 b5 d1 21 d1 a3 d3 c1 f2 dd e2 d3 a4 b3 df b5 d1 21 df a3 f3 d3 a1 c4 c5',
      ascii: '.......B....I......!................!.....',
    },
    {
      id: 'PKT-9925',
      timestamp: '14:03:03.0010',
      source: '10.0.4.19',
      destination: '172.16.0.5',
      protocol: 'TCP',
      length: 1480,
      info: 'Flags [.], ACK=242, Win=16020, Len=1440',
      hex: '45 00 05 dc a1 f1 40 00 40 06 c1 f2 0a 00 04 13 0a 00 00 05 00 50 04 d2 00 00 00 f2 00 00 00 a1 80 10 3e a4 f1 d2 00 00',
      ascii: 'E.....@.@..........P...........>..........',
    },
  ];

  // Initialize
  useEffect(() => {
    setPackets(initialPacketPool);
    setSelectedPacket(initialPacketPool[0]);
  }, []);

  // Simulate incoming packets
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      const randomPacket = initialPacketPool[Math.floor(Math.random() * initialPacketPool.length)];
      
      // Update with new IDs & subseconds
      const now = new Date();
      const formatTime = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(4, '0')}`;
      const nextId = `PKT-${Math.floor(Math.random() * 9000) + 1000}`;
      
      const newPacket: CapturedPacket = {
        ...randomPacket,
        id: nextId,
        timestamp: formatTime,
      };

      setPackets((prev) => {
        const withNew = [newPacket, ...prev];
        return withNew.slice(0, 15); // keep last 15
      });

      setPacketsCapturedCount((prev) => prev + 1);
      if (Math.random() > 0.98) {
        setPacketsDroppedCount((prev) => prev + 1);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const filteredPackets = packets.filter((p) => {
    if (filterProto === 'ALL') return true;
    return p.protocol === filterProto;
  });

  return (
    <div className="space-y-6">
      {/* Captured Count & Control Header */}
      <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary/15 rounded-lg text-secondary pulse-cyan">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">Network Packet Capture (Live)</h2>
            <p className="text-xs text-on-surface-variant/60 font-mono mt-1">
              Interface: <strong className="text-white">eth0</strong> // Mode: Promiscuous
            </p>
          </div>
        </div>

        {/* Counts */}
        <div className="flex gap-6 font-mono text-xs">
          <div className="border-l border-outline-variant/30 pl-4">
            <p className="text-on-surface-variant text-[10px] uppercase">Packets Captured</p>
            <p className="text-sm font-bold text-primary mt-0.5">
              {packetsCapturedCount.toLocaleString()}
            </p>
          </div>
          <div className="border-l border-outline-variant/30 pl-4">
            <p className="text-on-surface-variant text-[10px] uppercase">Packets Dropped</p>
            <p className="text-sm font-bold text-error mt-0.5">
              {packetsDroppedCount.toLocaleString()}
            </p>
          </div>
          <div className="border-l border-outline-variant/30 pl-4">
            <p className="text-on-surface-variant text-[10px] uppercase">Buffer status</p>
            <p className="text-sm font-bold text-secondary-fixed-dim mt-0.5">0.03%</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCapturing(!isCapturing)}
            className={`px-4 py-2 rounded font-mono text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ${
              isCapturing
                ? 'bg-error/15 hover:bg-error/25 text-error border border-error/30'
                : 'bg-primary-container text-on-primary-container hover:brightness-110'
            }`}
          >
            {isCapturing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isCapturing ? 'PAUSE CAPTURE' : 'RESUME CAPTURE'}
          </button>
          <button
            onClick={() => {
              setPackets([]);
              setPacketsDroppedCount(0);
            }}
            className="p-2 border border-outline-variant/30 text-on-surface-variant hover:text-white rounded hover:bg-surface-container-highest transition-colors"
            title="Clear Buffer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Protocol Filtering Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-xs font-mono text-on-surface-variant/70 uppercase px-2">Filters:</span>
        {['ALL', 'TCP', 'UDP', 'ICMP', 'TLS 1.3', 'SSH'].map((proto) => (
          <button
            key={proto}
            onClick={() => setFilterProto(proto)}
            className={`px-3 py-1 text-xs font-mono rounded border transition-all ${
              filterProto === proto
                ? 'bg-primary/20 border-primary text-primary font-bold'
                : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {proto}
          </button>
        ))}
      </div>

      {/* Capture Stream Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Packets Stream */}
        <div className="lg:col-span-8 glass-card rounded-xl overflow-hidden flex flex-col h-[520px]">
          <div className="px-4 py-3 bg-surface-container-high/60 border-b border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-on-surface uppercase tracking-wider">
              Live Stream Buffer
            </span>
            <span className="text-[10px] font-mono text-secondary-fixed-dim">
              {isCapturing ? '● Capturing packets...' : 'Capture Paused'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-[10px] text-outline uppercase tracking-wider border-b border-outline-variant/10">
                <tr>
                  <th className="px-4 py-2.5">Time</th>
                  <th className="px-4 py-2.5">Protocol</th>
                  <th className="px-4 py-2.5">Source IP</th>
                  <th className="px-4 py-2.5">Destination IP</th>
                  <th className="px-4 py-2.5">Length</th>
                  <th className="px-4 py-2.5">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredPackets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant/60">
                      No packets captured matching active protocol filters.
                    </td>
                  </tr>
                ) : (
                  filteredPackets.map((pkt) => (
                    <tr
                      key={pkt.id}
                      onClick={() => setSelectedPacket(pkt)}
                      className={`hover:bg-surface-container-highest/20 cursor-pointer transition-colors ${
                        selectedPacket?.id === pkt.id ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      <td className="px-4 py-2 text-[11px] text-on-surface-variant/85 whitespace-nowrap">
                        {pkt.timestamp}
                      </td>
                      <td className="px-4 py-2">
                        <span className="px-1.5 py-0.5 bg-surface-container-highest rounded text-[10px] font-bold text-white uppercase">
                          {pkt.protocol}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-on-surface font-medium truncate max-w-[120px]">
                        {pkt.source}
                      </td>
                      <td className="px-4 py-2 text-on-surface font-medium truncate max-w-[120px]">
                        {pkt.destination}
                      </td>
                      <td className="px-4 py-2 text-secondary-fixed-dim font-bold">
                        {pkt.length} B
                      </td>
                      <td className="px-4 py-2 text-xs truncate max-w-[200px]" title={pkt.info}>
                        {pkt.info}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payload / Hex Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-5 flex flex-col h-[520px] justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/10">
                <Terminal className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-on-surface">
                  Packet Hex Dump Inspector
                </h3>
              </div>

              {selectedPacket ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-surface-container-lowest/80 p-3 rounded border border-outline-variant/20">
                    <div>
                      <p className="text-outline uppercase text-[9px]">Packet ID:</p>
                      <p className="text-on-surface font-bold">{selectedPacket.id}</p>
                    </div>
                    <div>
                      <p className="text-outline uppercase text-[9px]">Timestamp:</p>
                      <p className="text-on-surface font-bold">{selectedPacket.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-outline uppercase text-[9px]">Length bytes:</p>
                      <p className="text-secondary font-bold">{selectedPacket.length} bytes</p>
                    </div>
                    <div>
                      <p className="text-outline uppercase text-[9px]">Protocol Type:</p>
                      <p className="text-primary font-bold">{selectedPacket.protocol}</p>
                    </div>
                  </div>

                  {/* Hex Area */}
                  <div>
                    <span className="block font-mono text-[9px] text-outline uppercase mb-1">
                      Hexadecimal Stream:
                    </span>
                    <div className="bg-surface-container-lowest/90 font-mono text-[11px] p-3 rounded leading-relaxed text-secondary-fixed-dim border border-outline-variant/15 select-all custom-scrollbar overflow-x-auto break-all max-h-36">
                      {selectedPacket.hex}
                    </div>
                  </div>

                  {/* ASCII decoding Area */}
                  <div>
                    <span className="block font-mono text-[9px] text-outline uppercase mb-1">
                      ASCII Decoding:
                    </span>
                    <div className="bg-surface-container-lowest/90 font-mono text-[11px] p-3 rounded leading-relaxed text-on-surface border border-outline-variant/15 select-all custom-scrollbar overflow-x-auto break-all max-h-24">
                      {selectedPacket.ascii}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-on-surface-variant/50 flex flex-col items-center gap-2">
                  <Info className="w-8 h-8 text-outline-variant" />
                  <p className="text-xs">Select a captured packet to inspect hex dumps and ASCII outputs.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-outline-variant/10 text-xs font-mono text-on-surface-variant/80">
              <span className="text-secondary font-bold">Heuristic Note:</span> SSH/TLS decodes show encrypted blocks. Aegis heuristic filters flag non-standard payloads for review automatically.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
