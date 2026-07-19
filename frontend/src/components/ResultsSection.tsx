'use client';

import React, { useState } from 'react';
import { HavenResponse } from '../types';
import {
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Heart,
  FileText,
  Copy,
  Download,
  Globe2,
  ListOrdered,
  Building2,
  Check
} from 'lucide-react';

interface ResultsSectionProps {
  data: HavenResponse;
}

export default function ResultsSection({ data }: ResultsSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyDocument = () => {
    if (data.generated_document) {
      navigator.clipboard.writeText(data.generated_document);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    if (!data.generated_document) return;
    const element = document.createElement('a');
    const file = new Blob([data.generated_document], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'HavenAI_Official_Assistance_Document.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper to map detected language string to emoji/code.
  // Full names (or exact ISO codes) only — substring checks on short codes
  // mislabel languages like Dari ("ar") or Portuguese ("es").
  const getLangBadge = (lang: string) => {
    const l = lang.toLowerCase().trim();
    if (l.includes('pashto') || l.includes('dari') || l === 'ps') return '🇦🇫 Pashto / Dari';
    if (l.includes('arabic') || l === 'ar') return '🇸🇦 Arabic';
    if (l.includes('ukrain') || l === 'uk') return '🇺🇦 Ukrainian';
    if (l.includes('spanish') || l === 'es') return '🇪🇸 Spanish';
    if (l.includes('french') || l === 'fr') return '🇫🇷 French';
    if (l.includes('german') || l === 'de') return '🇩🇪 German';
    if (l.includes('russian') || l === 'ru') return '🇷🇺 Russian';
    return `🌐 ${lang}`;
  };

  // Severity comes from the Situation Agent: low | medium | high | critical
  const severity = (data.severity || 'medium').toLowerCase();
  const severityStyles: Record<string, string> = {
    critical: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20',
    high: 'bg-orange-50 text-orange-600 border-orange-200',
    medium: 'bg-amber-50 text-amber-600 border-amber-200',
    low: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 fade-in">
      {/* 1. Response in Your Language Card */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#0891B2]/30 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#0891B2]/10 rounded-xl text-[#0891B2]">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A1A2E]">
                Response in Your Language
              </h3>
              <p className="text-xs text-gray-500">
                Translated & localized for your immediate comfort
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0891B2]/10 text-[#0891B2]">
            {getLangBadge(data.detected_language || 'Auto')}
          </span>
        </div>

        <div
          dir="auto"
          className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-5 sm:p-6 text-gray-800 text-lg sm:text-xl leading-relaxed font-medium whitespace-pre-line"
        >
          {data.response_in_user_language || data.final_response}
        </div>
      </div>

      {/* 2. Situation Summary Card */}
      <div className="bg-white rounded-2xl shadow-md border-l-4 border-[#0891B2] border-r border-t border-b border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-[#0891B2]" />
            <h3 className="text-xl font-bold text-[#1A1A2E]">Situation Assessment</h3>
          </div>
          <span
            className={`border font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
              severityStyles[severity] ?? 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {severity} Severity
          </span>
        </div>

        <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
          {data.situation_summary}
        </p>

        {/* Urgent Needs Badges */}
        {data.urgent_needs && data.urgent_needs.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Identified Urgent Needs:
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.urgent_needs.map((need, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                    idx % 2 === 0
                      ? 'bg-red-50 text-[#DC2626] border-red-200'
                      : 'bg-amber-50 text-[#D97706] border-amber-200'
                  }`}
                >
                  ⚠️ {need}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Next Steps Card */}
      {data.next_steps && data.next_steps.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border-l-4 border-[#16A34A] border-r border-t border-b border-gray-100 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <ListOrdered className="w-6 h-6 text-[#16A34A]" />
            <h3 className="text-xl font-bold text-[#1A1A2E]">Recommended Action Plan</h3>
          </div>

          <div className="space-y-4">
            {data.next_steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition">
                <div className="w-8 h-8 rounded-full bg-[#0891B2] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <p className="text-gray-800 text-base pt-1 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Nearby Resources Card */}
      {data.nearby_resources && data.nearby_resources.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Building2 className="w-6 h-6 text-[#0891B2]" />
            <div>
              <h3 className="text-xl font-bold text-[#1A1A2E]">Nearby Humanitarian Resources</h3>
              <p className="text-xs text-gray-500">AI-suggested organizations — please verify contact details before relying on them</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.nearby_resources.map((res, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-[#0891B2]/50 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#0891B2]/10 text-[#0891B2] font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {res.type || 'Humanitarian'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1A1A2E] mb-2">{res.name}</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{res.description}</p>
                </div>

                <div className="border-t border-gray-200 pt-3 flex items-center text-sm font-semibold text-gray-800">
                  <Phone className="w-4 h-4 text-[#16A34A] mr-2 shrink-0" />
                  <span className="truncate">{res.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Emotional Support Card */}
      {data.emotional_support && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h3 className="text-xl font-bold text-blue-950">A Message of Support</h3>
          </div>
          <p className="text-blue-900 text-base sm:text-lg italic leading-relaxed pl-2 border-l-2 border-rose-300">
            "{data.emotional_support}"
          </p>
        </div>
      )}

      {/* 6. Generated Document Card (If Available) */}
      {data.generated_document && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-300 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A2E]">
                  Official Assistance Document
                </h3>
                <p className="text-xs text-gray-500">
                  Generated document for aid agencies and border officials
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyDocument}
                className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-1.5 bg-[#0891B2] hover:bg-[#0e7490] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          </div>

          <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {data.generated_document}
          </pre>
        </div>
      )}
    </section>
  );
}
