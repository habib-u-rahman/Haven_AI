'use client';

import React, { useState } from 'react';
import { MapPin, FileText, Send, Loader2, HeartHandshake } from 'lucide-react';
import { HavenRequest } from '../types';

interface InputSectionProps {
  onSubmit: (request: HavenRequest) => void;
  isLoading: boolean;
}

export default function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [needDocument, setNeedDocument] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please describe your situation so our AI agents can help you.');
      return;
    }
    if (!location.trim()) {
      setError('Please provide your current city or country to find nearby resources.');
      return;
    }
    setError('');
    onSubmit({
      message: message.trim(),
      location: location.trim(),
      language: 'auto',
      need_document: needDocument,
    });
  };

  return (
    <section id="get-help" className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border-t-4 border-[#0891B2] border-x border-b border-gray-100 p-6 sm:p-10 slide-up">
        {/* Card Header */}
        <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
          <div className="p-3 bg-[#0891B2]/10 rounded-xl">
            <HeartHandshake className="w-7 h-7 text-[#0891B2]" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">
              Tell us your situation
            </h2>
            <p className="text-sm text-gray-500">
              Speak freely in your native language. We will process your request securely and privately.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Situation Textarea */}
          <div>
            <label className="block text-sm font-bold text-[#1A1A2E] mb-2">
              Describe your situation
            </label>
            <textarea
              rows={5}
              disabled={isLoading}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Describe your situation in any language... e.g. "I fled my country 3 days ago with my family. We need food and shelter urgently."'
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0891B2] focus:border-[#0891B2] transition outline-none text-[#1A1A2E] placeholder-gray-400 bg-gray-50 focus:bg-white resize-y"
            />
          </div>

          {/* Location Input & Document Checkbox Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Input */}
            <div>
              <label className="block text-sm font-bold text-[#1A1A2E] mb-2">
                Your Current Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-[#0891B2]" />
                </div>
                <input
                  type="text"
                  disabled={isLoading}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your current city or country"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0891B2] focus:border-[#0891B2] transition outline-none text-[#1A1A2E] placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Document Toggle Checkbox */}
            <div className="flex items-center pt-2 md:pt-7">
              <label className="relative flex items-center cursor-pointer space-x-3 select-none">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  checked={needDocument}
                  onChange={(e) => setNeedDocument(e.target.checked)}
                  className="w-5 h-5 text-[#0891B2] rounded border-gray-300 focus:ring-[#0891B2] cursor-pointer"
                />
                <span className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-[#0891B2]" />
                  <span>Generate official assistance document</span>
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0891B2] hover:bg-[#0e7490] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 flex items-center justify-center space-x-2 text-lg cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                  <span>
                    HavenAI is analyzing your situation<span className="animate-pulse">...</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Get Help Now</span>
                  <Send className="w-5 h-5" />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
