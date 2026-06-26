import React, { useState, useEffect } from 'react';

interface LoadingProgressProps {
  isLoading: boolean;
}

const STAGES = [
  { time: 0, text: 'Analyzing topic and structuring content outline...' },
  { time: 3000, text: 'Drafting markdown copy and adjusting tone...' },
  { time: 7000, text: 'Generating matching visual cover asset...' },
  { time: 11000, text: 'Finalizing layout and compiling document...' }
];

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(STAGES[0].text);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setStatusText(STAGES[0].text);
      return;
    }

    const startTime = Date.now();
    
    // Progress interval (fakes progress up to 95%)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Asymptotic progress bar: grows fast early, slows down near 95%
      setProgress(() => {
        const target = 95;
        const rate = 0.0001; // slowdown coefficient
        const val = target * (1 - Math.exp(-rate * elapsed));
        return parseFloat(val.toFixed(0));
      });

      // Update stage text based on elapsed time
      const currentStage = [...STAGES]
        .reverse()
        .find(stage => elapsed >= stage.time);
      
      if (currentStage) {
        setStatusText(currentStage.text);
      }
    }, 200);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="w-full border border-neutral-200 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
      {/* Header and percentage indicator */}
      <div className="flex justify-between items-center">
        <div className="space-y-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Content Generation in progress</span>
          <h3 className="text-sm font-semibold text-neutral-800 transition-all duration-350">{statusText}</h3>
        </div>
        <span className="text-sm font-bold text-neutral-800 tabular-nums">{progress}%</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-black h-1.5 rounded-full transition-all duration-350 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Shimmer Skeleton preview */}
      <div className="space-y-4 pt-2">
        {/* Mock Title block */}
        <div className="h-6 bg-neutral-100 rounded-lg animate-pulse w-3/4" />
        
        {/* Mock Image block */}
        <div className="aspect-video bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Mock Paragraph lines */}
        <div className="space-y-2">
          <div className="h-3 bg-neutral-100 rounded animate-pulse w-full" />
          <div className="h-3 bg-neutral-100 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-neutral-100 rounded animate-pulse w-2/3" />
        </div>
      </div>
    </div>
  );
};
