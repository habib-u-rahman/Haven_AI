'use client';

import React, { useState } from 'react';
import { HavenResponse } from '../types';
import Typewriter from './Typewriter';
import {
  AlertCircle,
  MapPin,
  Phone,
  Heart,
  FileText,
  Copy,
  Download,
  Globe2,
  ListOrdered,
  Building2,
  Check,
  ExternalLink,
  Search
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

  const handleDownloadDocument = () => {
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
    if (l.includes('urdu') || l === 'ur') return '🇵🇰 Urdu';
    return `🌐 ${lang}`;
  };

  const langLower = (data.detected_language || 'english').toLowerCase().trim();
  const isEnglish = langLower.includes('english') || langLower === 'en';

  // Severity comes from the Situation Agent: low | medium | high | critical
  const severity = (data.severity || 'medium').toLowerCase();
  const severityStyles: Record<string, string> = {
    critical: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20',
    high: 'bg-orange-50 text-orange-600 border-orange-200',
    medium: 'bg-amber-50 text-amber-600 border-amber-200',
    low: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  const typeEmoji: Record<string, string> = {
    unhcr: '🛡️',
    food: '🍞',
    shelter: '🏠',
    legal: '⚖️',
    medical: '🏥',
    general: '🤝',
  };

  const websiteUrl = (site: string) =>
    site.startsWith('http') ? site : `https://${site}`;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* 1. Response in the user's own language — only shown when they didn't
          write in English (for English users it would duplicate the cards below) */}
      {!isEnglish && (
        <div className="fade-in bg-white rounded-2xl shadow-sm border-2 border-[#0891B2]/30 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#0891B2]/10 rounded-xl text-[#0891B2]">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A2E]">Your Answer</h3>
                <p className="text-xs text-gray-500">Written in your own language</p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0891B2]/10 text-[#0891B2]">
              {getLangBadge(data.detected_language || 'Auto')}
            </span>
          </div>

          <div
            dir="auto"
            className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-5 sm:p-6 text-gray-800 text-lg leading-relaxed font-medium whitespace-pre-line"
          >
            <Typewriter text={data.response_in_user_language || data.final_response} speed={22} />
          </div>
        </div>
      )}

      {/* 2. Warm support message — typed out like a live chat reply */}
      {data.emotional_support && (
        <div
          className="fade-in bg-white rounded-2xl shadow-sm border-l-4 border-rose-300 border-r border-t border-b border-gray-100 p-6 sm:p-8"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h3 className="text-xl font-bold text-[#1A1A2E]">A Message for You</h3>
          </div>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            <Typewriter text={data.emotional_support} speed={26} startDelay={isEnglish ? 200 : 900} />
          </p>
        </div>
      )}

      {/* 3. Situation Assessment */}
      <div
        className="fade-in bg-white rounded-2xl shadow-sm border-l-4 border-[#0891B2] border-r border-t border-b border-gray-100 p-6 sm:p-8"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-[#0891B2]" />
            <h3 className="text-xl font-bold text-[#1A1A2E]">What We Understood</h3>
          </div>
          <span
            className={`border font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
              severityStyles[severity] ?? 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {severity} Severity
          </span>
        </div>

        <p className="text-gray-700 text-base sm:text-lg mb-5 leading-relaxed">
          <Typewriter text={data.situation_summary} speed={24} startDelay={1200} />
        </p>

        {data.urgent_needs && data.urgent_needs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
              Urgent needs:
            </span>
            {data.urgent_needs.map((need, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-sm font-semibold bg-red-50 text-[#DC2626] border border-red-200 capitalize"
              >
                {need}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Next Steps */}
      {data.next_steps && data.next_steps.length > 0 && (
        <div
          className="fade-in bg-white rounded-2xl shadow-sm border-l-4 border-[#16A34A] border-r border-t border-b border-gray-100 p-6 sm:p-8"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <ListOrdered className="w-6 h-6 text-[#16A34A]" />
            <h3 className="text-xl font-bold text-[#1A1A2E]">Your Next Steps</h3>
          </div>

          <div className="space-y-3">
            {data.next_steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-sm shrink-0">
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

      {/* 5. Nearby Resources with full contact details */}
      {data.nearby_resources && data.nearby_resources.length > 0 && (
        <div
          className="fade-in bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Building2 className="w-6 h-6 text-[#0891B2]" />
            <div>
              <h3 className="text-xl font-bold text-[#1A1A2E]">Organizations That Can Help</h3>
              <p className="text-xs text-gray-500">
                AI-suggested organizations — please verify contact details before relying on them
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.nearby_resources.map((res, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-[#0891B2]/40 transition-colors duration-200 flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-[#0891B2]/10 text-[#0891B2] font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {typeEmoji[res.type] ?? '🤝'} {res.type || 'Support'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#1A1A2E] mb-1.5">{res.name}</h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">{res.description}</p>

                {/* Contact detail rows */}
                <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                  {res.location && (
                    <div className="flex items-start text-gray-700">
                      <MapPin className="w-4 h-4 text-[#0891B2] mr-2 mt-0.5 shrink-0" />
                      <span>{res.location}</span>
                    </div>
                  )}
                  {res.phone && (
                    <a
                      href={`tel:${res.phone.replace(/\s+/g, '')}`}
                      className="flex items-start text-gray-800 font-semibold hover:text-[#0891B2] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#16A34A] mr-2 mt-0.5 shrink-0" />
                      <span>{res.phone}</span>
                    </a>
                  )}
                  {res.website && (
                    <a
                      href={websiteUrl(res.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start text-[#0891B2] font-semibold hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      <span className="truncate">{res.website}</span>
                    </a>
                  )}
                  {!res.phone && !res.website && res.contact && (
                    <div className="flex items-start text-gray-600">
                      <Search className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                      <span>{res.contact}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Generated Document — styled as a paper letter */}
      {data.generated_document && (
        <div
          className="fade-in bg-white rounded-2xl shadow-sm border-2 border-amber-200 p-6 sm:p-8"
          style={{ animationDelay: '1s' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A2E]">Your Assistance Letter</h3>
                <p className="text-xs text-gray-500">
                  Fill in the [bracketed] details, then present it to aid agencies or officials
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyDocument}
                className="flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadDocument}
                className="flex items-center space-x-1.5 bg-[#0891B2] hover:bg-[#0e7490] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Paper-letter styling instead of a code terminal */}
          <div className="bg-[#FDFCF8] border border-gray-300 rounded-lg shadow-inner px-6 py-8 sm:px-10 sm:py-10">
            <pre className="whitespace-pre-wrap font-serif text-sm sm:text-base text-gray-800 leading-relaxed">
              {data.generated_document}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
