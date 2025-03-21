'use client';

import { useState } from 'react';
import { processTextWithAI } from '../lib/utils';

export default function TextUpload({ onProcessText }) {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to process');
      return;
    }
    
    try {
      setError(null);
      setProcessing(true);
      
      // Process the text with AI
      const extractedData = await processTextWithAI(text);
      
      // Check if response contains an error message
      if (extractedData.error) {
        console.error('AI processing error:', extractedData.error);
        setError(`Error from AI service: ${extractedData.error}`);
        setProcessing(false);
        return;
      }
      
      // Call the parent component's callback with the extracted data
      onProcessText(extractedData);
    } catch (err) {
      console.error('Error processing text:', err);
      
      // More specific error messages
      if (err.message.includes('API key')) {
        setError('API key error. Please check your OpenAI API key configuration.');
      } else if (err.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError('Failed to process the text. Please try with more structured information about schedules and dates.');
      }
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="card p-8 animate-slide-up w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        Paste Schedule Text
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 w-full">
          <p className="text-muted-foreground mb-4">
            Paste in email text, notes, or any text containing schedule information. 
            Our AI will extract member names, availability, and lesson dates.
          </p>
          
          <div className="w-full">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your schedule text here... (e.g., 'Tennis lessons will be on Jan 10, 17, 24...')"
              className="w-full min-h-[350px] border border-[#e2e8f0] rounded-lg p-6 resize-y text-base leading-relaxed shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              disabled={processing}
              style={{ 
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                lineHeight: '1.6',
                width: '100%'
              }}
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800/40 rounded-xl text-red-600 dark:text-red-400 shadow-lg shadow-red-500/5 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-base mb-1">Error Processing Text</h4>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="button button-primary"
            disabled={processing || !text.trim()}
          >
            {processing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26z" />
                  <path d="M9.878 6.878a3 3 0 007.242 0H19a1 1 0 11-2 0h-3.1a1 1 0 00.1-1.9 1.1 1.1 0 00-2.2 0 1 1 0 101.9 1H9.878zM4 15.757V15a1 1 0 012 0v.757l1.879-1.879a1 1 0 011.415 1.414l-3.594 3.594a1 1 0 01-1.415 0l-3.594-3.594a1 1 0 111.415-1.414L4 15.757z" />
                </svg>
                Process with AI
              </div>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-muted/30 to-secondary/5 rounded-2xl border border-secondary/10 shadow-lg shadow-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Tips for Best Results</h3>
          </div>
          <ul className="space-y-3 pl-5">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Include clear information about lesson dates (e.g., "Tuesdays: Jan 7, 14, 21")</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>List member names followed by their unavailable dates</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Structured text from emails, spreadsheets, or notes works best</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Include the year for dates when possible</span>
            </li>
          </ul>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-muted/30 to-primary/5 rounded-2xl border border-primary/10 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Examples That Work Well</h3>
          </div>
          
          <div className="space-y-4 mt-2">
            <div className="p-4 bg-card rounded-xl border border-border/50 text-sm">
              <p className="font-medium mb-1">Example 1: Schedule with Dates</p>
              <p className="text-muted-foreground">
                "Tennis lessons will be on Tuesdays: Jan 7, 14, 21, 28 and Feb 4, 11. John can't attend on Jan 14 and Feb 4. Sarah is unavailable on Jan 21."
              </p>
            </div>
            
            <div className="p-4 bg-card rounded-xl border border-border/50 text-sm">
              <p className="font-medium mb-1">Example 2: Member List</p>
              <p className="text-muted-foreground">
                "Members: <br />
                - Michael Smith (unavailable: Jan 3, Jan 17) <br />
                - Emma Johnson (unavailable: Jan 10) <br />
                - Robert Williams (all dates available)"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}