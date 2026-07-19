'use client';

import React from 'react';
import { Shield, Radio } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#0891B2] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Haven<span className="text-[#FCD34D]">AI</span>
              </span>
            </div>
            <p className="text-xs text-teal-100 font-medium hidden sm:block">
              AI-powered refuge for the displaced
            </p>
          </div>
        </div>

        {/* 24/7 Availability Badge */}
        <div className="flex items-center space-x-2 bg-black/15 px-3 py-1.5 rounded-full border border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Radio className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-xs font-semibold tracking-wide text-white">
            Available 24/7
          </span>
        </div>
      </div>
    </header>
  );
}
