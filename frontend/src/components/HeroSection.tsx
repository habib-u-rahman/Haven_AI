'use client';

import React from 'react';
import { Sparkles, Globe, Cpu, Clock, ArrowRight, Info } from 'lucide-react';

export default function HeroSection() {
  const scrollToInput = () => {
    const el = document.getElementById('get-help');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToInput();
    }
  };

  return (
    <section className="relative bg-[#1A1A2E] text-white py-16 md:py-24 overflow-hidden border-b border-gray-800">
      {/* Subtle diagonal pattern background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #0891B2 0, #0891B2 1px, transparent 0, transparent 50px)`,
        }}
      />

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0891B2]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
        {/* Model Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#FCD34D]" />
          <span className="text-xs sm:text-sm font-medium text-gray-200">
            Powered by GPT-4o + Gemini + Groq
          </span>
        </div>

        {/* Large Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          You Are Not Alone
        </h1>

        {/* Subtitle in Teal */}
        <h2 className="text-xl sm:text-3xl font-bold text-[#0891B2] mb-6">
          AI assistance for refugees and displaced people
        </h2>

        {/* Description */}
        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Describe your situation in any language. HavenAI understands, finds help, and guides you — instantly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={scrollToInput}
            className="w-full sm:w-auto bg-[#0891B2] hover:bg-[#0e7490] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition duration-200 flex items-center justify-center space-x-2 text-lg group cursor-pointer"
          >
            <span>Get Help Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto border-2 border-white/80 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 text-lg cursor-pointer"
          >
            <Info className="w-5 h-5" />
            <span>How it works</span>
          </button>
        </div>

        {/* 3 Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl text-center hover:border-[#0891B2]/50 transition duration-300">
            <Globe className="w-8 h-8 text-[#0891B2] mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">100+</h3>
            <p className="text-sm text-gray-400 font-medium">Languages supported</p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl text-center hover:border-[#0891B2]/50 transition duration-300">
            <Cpu className="w-8 h-8 text-[#FCD34D] mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">5 AI Agents</h3>
            <p className="text-sm text-gray-400 font-medium">Working for you</p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl text-center hover:border-[#0891B2]/50 transition duration-300">
            <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">24/7</h3>
            <p className="text-sm text-gray-400 font-medium">Always available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
