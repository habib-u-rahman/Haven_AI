'use client';

import React, { useEffect, useState } from 'react';
import { HeartHandshake } from 'lucide-react';

// Warm, reassuring lines that rotate while the agents work,
// so the wait never feels like a frozen screen.
const MESSAGES = [
  'Reading your message with care…',
  'Every detail you shared matters — nothing is ignored.',
  'Understanding your situation and what you need most…',
  'Searching for organizations that can really help you…',
  'Help exists in every country — we are finding yours.',
  'Preparing your personal step-by-step guidance…',
  'Writing your answer in your own language…',
  'Almost ready — putting everything together for you…',
];

export default function LoadingMessages() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white border border-cyan-100 rounded-2xl shadow-sm px-6 py-5 flex items-center space-x-4">
        {/* Gently pulsing icon */}
        <div className="p-2.5 bg-[#0891B2]/10 rounded-xl shrink-0">
          <HeartHandshake className="w-6 h-6 text-[#0891B2] animate-pulse" />
        </div>

        {/* key={idx} re-triggers the fade-in animation on every message change */}
        <p key={idx} className="fade-in flex-grow text-gray-700 font-medium text-sm sm:text-base">
          {MESSAGES[idx]}
        </p>

        {/* Three bouncing dots, offset like a chat "typing" indicator */}
        <div className="flex items-center space-x-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-bounce" style={{ animationDelay: '0.15s' }} />
          <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}
