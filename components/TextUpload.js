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
      
      // Call the parent component's callback with the extracted data
      onProcessText(extractedData);
    } catch (err) {
      console.error('Error processing text:', err);
      setError('Failed to process the text. Please try again with more structured text.');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="card p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        Paste Schedule Text
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">
            Paste in email text, notes, or any text containing schedule information. 
            Our AI will extract member names, availability, and lesson dates.
          </p>
          
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your schedule text here... (e.g., 'Tennis lessons will be on Jan 10, 17, 24...')"
            className="w-full min-h-[300px] border border-border rounded-lg p-4 bg-card resize-y"
            disabled={processing}
          />
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="button-primary"
            disabled={processing || !text.trim()}
          >
            {processing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Process with AI
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 p-4 bg-secondary/5 rounded-lg">
        <h3 className="font-medium text-base mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tips for Best Results
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Include clear information about lesson dates (e.g., "Tuesdays: Jan 7, 14, 21")</li>
          <li>List member names followed by their unavailable dates</li>
          <li>Structured text from emails, spreadsheets, or notes works best</li>
          <li>Include the year for dates when possible</li>
          <li>After processing, you'll have a chance to review and edit the extracted information</li>
        </ul>
      </div>
    </div>
  );
}