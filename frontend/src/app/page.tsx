'use client';

import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import InputSection from '../components/InputSection';
import AgentPipeline from '../components/AgentPipeline';
import LoadingMessages from '../components/LoadingMessages';
import ResultsSection from '../components/ResultsSection';
import Footer from '../components/Footer';
import { HavenRequest, HavenResponse } from '../types';
import { analyzeHaven } from '../lib/api';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = idle, 1..5 = steps, 6 = complete
  const [results, setResults] = useState<HavenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pipelineRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (request: HavenRequest) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setActiveStep(1);

    // Scroll to pipeline section
    setTimeout(() => {
      pipelineRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Animate pipeline steps while making API call
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const response = await analyzeHaven(request);
      clearInterval(stepInterval);
      setActiveStep(5);

      // Wait a moment on step 5 before showing results
      setTimeout(() => {
        setActiveStep(6);
        setResults(response);
        setIsLoading(false);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 600);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setActiveStep(0);
      console.error('API Error:', err);
      setError('Our AI is temporarily unavailable. Please try again in a moment.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A2E] selection:bg-[#0891B2]/20">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />

        <InputSection onSubmit={handleFormSubmit} isLoading={isLoading} />

        {/* Error Alert Message */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6 fade-in">
            <div className="bg-red-50 border-2 border-red-200 text-red-800 p-5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                <span className="font-semibold text-sm sm:text-base">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex items-center space-x-1 text-xs font-bold bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition text-red-700 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        )}

        {/* Agent Pipeline — always visible: idle it explains "How it works",
            during analysis it shows live progress */}
        <div ref={pipelineRef} className="my-8">
          <AgentPipeline activeStep={activeStep} />
        </div>

        {/* Rotating reassurance messages while the agents work */}
        {isLoading && <LoadingMessages />}

        {/* Results Section */}
        {results && (
          <div ref={resultsRef} className="my-8">
            <ResultsSection data={results} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
