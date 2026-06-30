import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, TrendingUp, HelpCircle, Database, Cpu, Activity, Play } from 'lucide-react';

export default function ModelPerformanceView() {
  const [accuracy, setAccuracy] = useState(99.82);
  const [precision, setPrecision] = useState(98.45);
  const [recall, setRecall] = useState(97.91);
  const [f1Score, setF1Score] = useState(98.17);

  // Fluctuations simulating active evaluation updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAccuracy((prev) => {
        const drift = (Math.random() * 0.02 - 0.01);
        return parseFloat((prev + drift).toFixed(2));
      });
      setPrecision((prev) => {
        const drift = (Math.random() * 0.01 - 0.005);
        return parseFloat((prev + drift).toFixed(2));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Tab Subtitle Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10">
        <div>
          <h3 className="text-sm font-bold text-on-surface uppercase font-mono tracking-wider">
            Model Inference Metrics
          </h3>
          <p className="text-xs text-on-surface-variant/60 mt-1">
            Real-time validation against Global Threat Signature v4.12
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-surface-container px-3 py-1 rounded-lg border border-outline-variant/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim pulse-cyan" />
            <span className="font-mono text-[10px] text-on-surface">MODEL: THREAT-EYE-V2</span>
          </div>
          <div className="bg-surface-container px-3 py-1 rounded-lg border border-outline-variant/20">
            <span className="font-mono text-[10px] text-secondary-fixed-dim uppercase font-bold">
              TRAINING STATUS: STABLE
            </span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Accuracy */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-primary/30 transition-all">
          <p className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Accuracy
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-primary font-sans">
              {accuracy.toFixed(2)}%
            </h4>
            <span className="text-secondary-fixed-dim text-[11px] font-mono font-semibold">
              +0.04%
            </span>
          </div>
          <div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[99.8%]" />
          </div>
        </div>

        {/* Precision */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-secondary/30 transition-all">
          <p className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Precision
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-secondary-fixed-dim font-sans">
              {precision.toFixed(2)}%
            </h4>
            <span className="text-secondary-fixed-dim text-[11px] font-mono font-semibold">
              Steady
            </span>
          </div>
          <div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-secondary-fixed-dim w-[98.4%]" />
          </div>
        </div>

        {/* Recall */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-tertiary/30 transition-all">
          <p className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Recall
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-tertiary font-sans">
              {recall.toFixed(2)}%
            </h4>
            <span className="text-error text-[11px] font-mono font-semibold">
              -0.12%
            </span>
          </div>
          <div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-tertiary w-[97.9%]" />
          </div>
        </div>

        {/* F1 Score */}
        <div className="glass-card p-5 relative overflow-hidden group hover:border-primary/30 transition-all">
          <p className="font-mono text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            F1 Score
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-on-surface font-sans">
              {f1Score.toFixed(2)}%
            </h4>
            <span className="text-secondary-fixed-dim text-[11px] font-mono font-semibold">
              +0.01%
            </span>
          </div>
          <div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-on-surface w-[98.1%]" />
          </div>
        </div>
      </div>

      {/* Charts Grid: Historical Drift & Confusion Matrix */}
      <div className="grid grid-cols-12 gap-6">
        {/* Historical Drift Analysis */}
        <div className="col-span-12 lg:col-span-8 glass-card p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-sm font-bold font-mono text-on-surface uppercase tracking-wider">
              Historical Drift Analysis
            </h5>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">Current Version</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-outline-variant" />
                <span className="font-mono text-[10px] text-on-surface-variant uppercase">v2.3.8-stable</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mpGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#aec6ff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#aec6ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.03)" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.03)" />
              <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(255,255,255,0.03)" />
              <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(255,255,255,0.03)" />

              {/* Stable reference line */}
              <path
                d="M0,150 Q100,160 200,130 T400,140 T600,110 T800,120"
                fill="none"
                stroke="#414754"
                strokeDasharray="4,4"
                strokeWidth="2"
              />

              {/* Current Version Shaded Area */}
              <path
                d="M0,130 Q100,110 200,120 T400,90 T600,60 T800,50 L800,200 L0,200 Z"
                fill="url(#mpGrad)"
              />

              {/* Current Version Line */}
              <path
                d="M0,130 Q100,110 200,120 T400,90 T600,60 T800,50"
                fill="none"
                stroke="#aec6ff"
                strokeWidth="3"
              />

              {/* Pulse point marker */}
              <circle cx="600" cy="60" r="5" fill="#aec6ff" className="animate-pulse" />
            </svg>

            <div className="flex justify-between mt-4 px-2 font-mono text-[10px] text-on-surface-variant/40">
              <span>OCT 12</span>
              <span>OCT 15</span>
              <span>OCT 18</span>
              <span>OCT 21</span>
              <span>OCT 24</span>
              <span>LIVE EVAL</span>
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-xl flex flex-col justify-between">
          <h5 className="text-sm font-bold font-mono text-on-surface uppercase tracking-wider mb-6">
            Confusion Matrix
          </h5>

          <div className="grid grid-cols-2 gap-2 font-mono text-center text-xs">
            <div className="col-span-2 flex justify-between px-6 mb-2">
              <span className="text-[10px] text-on-surface-variant">PREDICTED NEG</span>
              <span className="text-[10px] text-on-surface-variant">PREDICTED POS</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-24 bg-surface-container-highest/40 flex flex-col items-center justify-center border border-white/5 relative rounded">
                <span className="text-primary text-lg font-bold">12,402</span>
                <span className="text-[9px] text-on-surface-variant mt-0.5">TRUE NEGATIVE</span>
                <div className="absolute left-[-22px] top-1/2 -rotate-90 text-[8px] text-on-surface-variant whitespace-nowrap">
                  ACTUAL NEG
                </div>
              </div>
              <div className="h-24 bg-error-container/20 flex flex-col items-center justify-center border border-error/10 relative rounded">
                <span className="text-error text-lg font-bold">142</span>
                <span className="text-[9px] text-on-surface-variant mt-0.5 font-semibold">FALSE NEGATIVE</span>
                <div className="absolute left-[-22px] top-1/2 -rotate-90 text-[8px] text-on-surface-variant whitespace-nowrap">
                  ACTUAL POS
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-24 bg-surface-container-highest/20 flex flex-col items-center justify-center border border-white/5 rounded">
                <span className="text-on-surface-variant text-lg font-bold">89</span>
                <span className="text-[9px] text-on-surface-variant mt-0.5">FALSE POSITIVE</span>
              </div>
              <div className="h-24 bg-primary-container/20 flex flex-col items-center justify-center border border-primary/20 rounded">
                <span className="text-primary text-lg font-bold">8,931</span>
                <span className="text-[9px] text-on-surface-variant mt-0.5">TRUE POSITIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: ROC Curve & Training Environment metadata */}
      <div className="grid grid-cols-12 gap-6">
        {/* ROC Curve */}
        <div className="col-span-12 lg:col-span-5 glass-card p-6 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-sm font-bold font-mono text-on-surface uppercase tracking-wider">
              ROC Curve
            </h5>
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/20 font-mono">
              AUC: 0.992
            </span>
          </div>

          <div className="h-44 flex items-center justify-center">
            <svg className="w-full h-full max-w-[180px]" viewBox="0 0 200 200">
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="white" strokeOpacity="0.1" />
              <line x1="0" y1="200" x2="200" y2="0" stroke="white" strokeDasharray="2,2" strokeOpacity="0.1" />
              <path d="M0,200 Q5,20 195,5 L200,0" fill="none" stroke="#aec6ff" strokeWidth="2.5" />
              <circle cx="195" cy="5" r="3.5" fill="#aec6ff" className="animate-pulse" />
            </svg>
          </div>

          <div className="flex justify-between mt-4 font-mono text-[9px] text-on-surface-variant/60 uppercase">
            <span>False Positive Rate</span>
            <span>True Positive Rate</span>
          </div>
        </div>

        {/* Training Environment Card */}
        <div className="col-span-12 lg:col-span-7 glass-card overflow-hidden rounded-xl flex flex-col justify-between">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
            <h5 className="text-sm font-bold font-mono text-on-surface uppercase tracking-wider">
              Training Environment Details
            </h5>
            <Database className="w-4 h-4 text-on-surface-variant" />
          </div>

          <div className="grid grid-cols-2 gap-px bg-outline-variant/10">
            <div className="bg-surface/40 p-4">
              <p className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
                Dataset Source
              </p>
              <p className="font-mono text-xs font-semibold text-white">Global-Threat-Intel-v4</p>
            </div>
            <div className="bg-surface/40 p-4">
              <p className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
                Sample Count
              </p>
              <p className="font-mono text-xs font-semibold text-white">4.2M Observations</p>
            </div>
            <div className="bg-surface/40 p-4">
              <p className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
                Compute Cluster
              </p>
              <p className="font-mono text-xs font-semibold text-white">NVIDIA-H100-Nodes [8]</p>
            </div>
            <div className="bg-surface/40 p-4">
              <p className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase tracking-wider font-bold">
                Training Duration
              </p>
              <p className="font-mono text-xs font-semibold text-white">08h 12m 44s</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono uppercase text-on-surface-variant">
                Epoch 150/150 Progress
              </span>
              <span className="text-xs text-primary font-mono font-bold tracking-wider">
                COMPLETED
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
