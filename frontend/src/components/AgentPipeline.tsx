'use client';

import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface AgentPipelineProps {
  activeStep: number; // 0 = idle explainer, 1..5 = agent running, 6 = complete
}

interface AgentInfo {
  id: number;
  icon: string;
  name: string;
  desc: string;
}

const AGENTS: AgentInfo[] = [
  { id: 1, icon: '🌐', name: 'Language', desc: 'Understands your language and translates your message' },
  { id: 2, icon: '🧠', name: 'Situation', desc: 'Assesses your needs and how urgent they are' },
  { id: 3, icon: '📄', name: 'Documents', desc: 'Prepares an official assistance letter if you need one' },
  { id: 4, icon: '🗺️', name: 'Resources', desc: 'Finds organizations that can help near you' },
  { id: 5, icon: '💙', name: 'Support', desc: 'Gives you encouragement and clear next steps' },
];

export default function AgentPipeline({ activeStep }: AgentPipelineProps) {
  const isIdle = activeStep === 0;
  const isDone = activeStep >= 6;

  return (
    <section id="how-it-works" className="scroll-mt-20 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A2E] mb-2">
            {isIdle ? 'How HavenAI works' : isDone ? 'All steps complete' : 'Working on your request…'}
          </h3>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {isIdle
              ? 'When you send your message, five specialized helpers handle it step by step:'
              : isDone
              ? 'Your personal guidance is ready below.'
              : 'Each step below is being handled for you right now. This usually takes under a minute.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {AGENTS.map((agent) => {
            const isCompleted = !isIdle && activeStep > agent.id;
            const isActive = activeStep === agent.id;

            return (
              <div
                key={agent.id}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-colors duration-300 ${
                  isActive
                    ? 'bg-cyan-50 border-[#0891B2]'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Step number / status indicator */}
                <div className="mb-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-[#16A34A]" />
                  ) : isActive ? (
                    <Loader2 className="w-7 h-7 text-[#0891B2] animate-spin" />
                  ) : (
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-300 text-xs font-bold text-gray-500">
                      {agent.id}
                    </span>
                  )}
                </div>

                <span className="text-2xl mb-2">{agent.icon}</span>

                <h4
                  className={`text-sm font-bold mb-1 ${
                    isActive ? 'text-[#0891B2]' : isCompleted ? 'text-[#16A34A]' : 'text-[#1A1A2E]'
                  }`}
                >
                  {agent.name}
                </h4>

                <p className="text-xs text-gray-500 leading-relaxed">{agent.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
