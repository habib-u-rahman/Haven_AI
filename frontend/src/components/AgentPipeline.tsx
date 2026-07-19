'use client';

import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface AgentPipelineProps {
  activeStep: number; // 0 to 5 (5 means complete)
}

interface AgentInfo {
  id: number;
  icon: string;
  name: string;
  desc: string;
}

const AGENTS: AgentInfo[] = [
  { id: 1, icon: '🌐', name: 'Language Agent', desc: 'Detecting language' },
  { id: 2, icon: '🧠', name: 'Situation Agent', desc: 'Understanding situation' },
  { id: 3, icon: '📄', name: 'Document Agent', desc: 'Generating documents' },
  { id: 4, icon: '🗺️', name: 'Resource Agent', desc: 'Finding nearby help' },
  { id: 5, icon: '💙', name: 'Support Agent', desc: 'Preparing guidance' },
];

export default function AgentPipeline({ activeStep }: AgentPipelineProps) {
  return (
    <section id="how-it-works" className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-2">
            5-Agent AI Pipeline
          </h3>
          <p className="text-sm text-gray-500">
            Specialized AI agents working synchronously to assess, translate, locate assistance, and support you.
          </p>
        </div>

        {/* Desktop Pipeline (Horizontal Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {AGENTS.map((agent) => {
            const isCompleted = activeStep > agent.id;
            const isActive = activeStep === agent.id;
            const isWaiting = activeStep < agent.id;

            return (
              <div
                key={agent.id}
                className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-50/70 border-[#0891B2] shadow-lg shadow-cyan-500/20 ring-2 ring-[#0891B2]/50 scale-105'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-300 text-gray-700'
                    : 'bg-gray-50 border-gray-200 opacity-60 text-gray-400'
                }`}
              >
                {/* Agent Icon + Status Indicator */}
                <div className="relative mb-3 flex items-center justify-center">
                  <span className="text-3xl">{agent.icon}</span>

                  <div className="absolute -bottom-1 -right-1">
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] bg-white rounded-full" />
                    )}
                    {isActive && (
                      <Loader2 className="w-5 h-5 text-[#0891B2] animate-spin bg-white rounded-full" />
                    )}
                    {isWaiting && (
                      <Circle className="w-4 h-4 text-gray-300 bg-white rounded-full" />
                    )}
                  </div>
                </div>

                {/* Agent Name */}
                <h4
                  className={`text-sm font-bold text-center mb-1 ${
                    isActive
                      ? 'text-[#0891B2]'
                      : isCompleted
                      ? 'text-[#16A34A]'
                      : 'text-gray-600'
                  }`}
                >
                  {agent.name}
                </h4>

                {/* Agent Status/Description */}
                <p className="text-xs text-center text-gray-500 font-medium">
                  {agent.desc}
                </p>

                {/* Status Badge */}
                <div className="mt-3">
                  {isActive && (
                    <span className="inline-block bg-[#0891B2] text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                      Processing
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-block bg-[#16A34A]/10 text-[#16A34A] text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                  {isWaiting && (
                    <span className="inline-block bg-gray-200 text-gray-400 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">
                      Waiting
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
