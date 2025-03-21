'use client';

import { useState } from 'react';

export default function ConstraintInput({ onSetConstraints, hasAIComments = false }) {
  const [maxGroupSize, setMaxGroupSize] = useState(4);
  const [mixGroups, setMixGroups] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSetConstraints({
      maxGroupSize,
      mixGroups,
      comments
    });
  };
  
  return (
    <div className="card p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <div className="h-8 w-8 bg-accent/10 dark:bg-accent/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
        Set Lesson Constraints
      </h2>
      
      <div className="card border-2 border-border p-6 mb-8 bg-gradient-to-b from-transparent to-muted/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Scheduling Settings</h3>
          <button 
            type="button" 
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-accent hover:underline flex items-center"
          >
            {expanded ? 'Show less' : 'Show advanced options'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <label className="block font-medium" htmlFor="max-group-size">
                  Group Size
                </label>
              </div>
              
              <div className="w-full sm:w-auto">
                <div className="flex items-center">
                  <button 
                    type="button" 
                    onClick={() => setMaxGroupSize(Math.max(2, maxGroupSize - 1))}
                    className="h-10 w-10 rounded-l-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="px-6 h-10 flex items-center justify-center border-t border-b border-border bg-muted/20">
                    <span className="text-lg font-medium">{maxGroupSize}</span>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setMaxGroupSize(Math.min(8, maxGroupSize + 1))}
                    className="h-10 w-10 rounded-r-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Players per group (2-8)
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <label htmlFor="mix-groups" className="block font-medium">
                    Mix Groups Between Lessons
                  </label>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      id="mix-groups"
                      type="checkbox"
                      checked={mixGroups}
                      onChange={(e) => setMixGroups(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted rounded-full peer 
                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-white after:border-muted after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all 
                      peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <p className="mt-2 text-sm text-muted-foreground">
                  When enabled, the scheduler will try to create varied groups so members play with different people across lessons.
                </p>
              </div>
            </div>
          </div>
          
          {hasAIComments && (
            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">Additional Comments</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add any special instructions or constraints for the AI scheduler.
                  </p>
                  
                  <div className="mt-4">
                    <textarea
                      className="w-full min-h-[120px] input"
                      placeholder="Example: 'Jennifer and Michael should always be in the same group' or 'Try to ensure each member has at least one lesson with everyone else'"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {expanded && (
            <div className="animate-slide-down bg-card border border-border/40 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">Advanced Options</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    More advanced options will be available in future updates.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="button-secondary group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            
            <button
              type="submit"
              className="button-primary group"
            >
              Generate Schedules
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}