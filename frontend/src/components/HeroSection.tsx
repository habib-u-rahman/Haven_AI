'use client';

import React from 'react';
import { Globe, HeartHandshake, Clock, ArrowRight, Info } from 'lucide-react';

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToForm = () => {
    scrollTo('get-help');
    // Focus the textarea so the visitor can start typing immediately
    setTimeout(() => {
      document.getElementById('situation-input')?.focus({ preventScroll: true });
    }, 500);
  };

  return (
    <section className="relative bg-[#1A1A2E] text-white py-16 md:py-20 border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Quiet audience badge — no tech jargon */}
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8">
          <HeartHandshake className="w-4 h-4 text-[#0891B2]" />
          <span className="text-xs sm:text-sm font-medium text-gray-300">
            Free help for refugees and displaced people — in your own language
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
          You are not alone.
        </h1>

        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Describe your situation in any language. HavenAI listens, understands,
          finds support services near you, and guides you through your next steps.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={goToForm}
            className="w-full sm:w-auto bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold px-8 py-4 rounded-xl shadow-md transition-colors duration-200 flex items-center justify-center space-x-2 text-lg cursor-pointer"
          >
            <span>Get Help Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full sm:w-auto border border-white/40 hover:border-white hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 text-lg cursor-pointer"
          >
            <Info className="w-5 h-5" />
            <span>How it works</span>
          </button>
        </div>

        {/* Three quiet reassurances */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl">
            <Globe className="w-6 h-6 text-[#0891B2] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">Any language</h3>
              <p className="text-xs text-gray-400">Write the way you speak — we understand and reply in your language.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl">
            <HeartHandshake className="w-6 h-6 text-[#0891B2] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">Real guidance</h3>
              <p className="text-xs text-gray-400">Support services, documents, and clear steps for your situation.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-xl">
            <Clock className="w-6 h-6 text-[#0891B2] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">Always available</h3>
              <p className="text-xs text-gray-400">Free and open 24/7, whenever you need someone to turn to.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
