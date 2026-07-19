'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white border-t border-gray-800 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-800 text-center md:text-left">
          {/* Left: HavenAI logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#0891B2]/20 p-2 rounded-xl border border-[#0891B2]/40">
              <Shield className="w-5 h-5 text-[#0891B2]" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Haven<span className="text-[#FCD34D]">AI</span>
              </span>
              <p className="text-xs text-gray-400">AI-powered refuge for the displaced</p>
            </div>
          </div>

          {/* Center: honest scope disclaimer */}
          <div className="text-xs text-gray-400 font-medium max-w-md text-center">
            HavenAI offers AI guidance, not legal advice. If you are in immediate
            danger, contact local emergency services first.
          </div>

          {/* Right: Hackathon Info */}
          <div className="text-xs text-gray-400 font-semibold">
            Hack-Nation Global AI Hackathon 2026
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 text-center text-xs text-gray-500 font-medium">
          Built with ❤️ to help those in need
        </div>
      </div>
    </footer>
  );
}
