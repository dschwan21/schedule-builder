'use client';

import { useState, useCallback } from 'react';
import { processImageWithAI } from '../lib/utils';

export default function ImageUpload({ onProcessImage }) {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  }, []);
  
  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleImageFile(file);
    }
  }, []);
  
  const handleImageFile = (file) => {
    // Reset any previous errors
    setError(null);
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }
    
    // Create file reader to get base64 data
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Create object URL for preview
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        setProcessing(true);
        
        // Process the image with AI
        const base64Data = e.target.result;
        const extractedData = await processImageWithAI(base64Data);
        
        // Check if response contains an error message
        if (extractedData.error) {
          console.error('AI processing error:', extractedData.error);
          setError(`Error from AI service: ${extractedData.error}`);
          setProcessing(false);
          return;
        }
        
        // Pass the extracted data to the parent component
        onProcessImage(extractedData);
      } catch (err) {
        console.error('Error processing image:', err);
        
        // More specific error messages
        if (err.message.includes('API key')) {
          setError('API key error. Please check your OpenAI API key configuration.');
        } else if (err.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else if (err.message.includes('image')) {
          setError('Image processing failed. Please try a clearer image with more visible text.');
        } else {
          setError('Failed to process the image. Please try again with a clearer image that shows schedule information.');
        }
        
        setProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
      setProcessing(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="card p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
          </svg>
        </div>
        Upload Schedule Image
      </h2>
      
      <div 
        className={`border-3 border-dashed rounded-xl p-10 text-center transition-all ${
          dragging 
            ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg shadow-primary/10 scale-[1.01]' 
            : 'border-border/60 hover:border-primary/40 bg-muted/10 hover:bg-gradient-to-br hover:from-transparent hover:to-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backdropFilter: 'blur(8px)'
        }}
      >
        {image ? (
          <div className="space-y-4">
            <img 
              src={image} 
              alt="Uploaded schedule" 
              className="max-h-64 mx-auto object-contain rounded-md"
            />
            
            {processing ? (
              <div className="flex flex-col items-center justify-center bg-muted/10 p-6 rounded-xl border border-primary/10 shadow-inner">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary relative"></div>
                </div>
                <h4 className="font-semibold text-lg mb-2 text-foreground">
                  Processing Image with AI
                </h4>
                <p className="text-muted-foreground">
                  Our AI is analyzing your schedule image.
                  <br />
                  <span className="text-sm">This may take a few moments...</span>
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="button button-secondary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Remove Image
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="relative w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div>
              <p className="text-lg text-foreground font-medium mb-3">
                Upload Your Schedule Image
              </p>
              <p className="text-muted-foreground mb-6">
                Drag & drop your schedule image here, or
              </p>
              
              <label className="inline-block button button-primary cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Browse Files
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Upload an image containing your tennis lesson schedule. 
              <br />
              Our AI will extract member names and availability.
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-6 p-5 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800/40 rounded-xl text-red-600 dark:text-red-400 shadow-lg shadow-red-500/5 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-base mb-1">Error Processing Image</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-muted/30 to-primary/5 rounded-2xl border border-primary/10 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Tips for Best Results</h3>
          </div>
          <ul className="space-y-3 pl-5">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Ensure your image is clear and well-lit</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Make sure names and dates are clearly visible</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Tables, spreadsheets, and calendars work best</span>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>For handwritten schedules, ensure the writing is legible</span>
            </li>
          </ul>
        </div>
      
        <div className="p-6 bg-gradient-to-br from-muted/30 to-secondary/5 rounded-2xl border border-secondary/10 shadow-lg shadow-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">How It Works</h3>
          </div>
          
          <ol className="relative ml-5 space-y-5 border-l-2 border-secondary/30 pl-6">
            <li className="relative">
              <div className="absolute -left-[31px] h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-secondary">1</span>
              </div>
              <h4 className="font-medium text-base">Upload Your Schedule</h4>
              <p className="text-sm text-muted-foreground">Drag and drop or browse to upload your schedule image</p>
            </li>
            <li className="relative">
              <div className="absolute -left-[31px] h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-secondary">2</span>
              </div>
              <h4 className="font-medium text-base">AI Processing</h4>
              <p className="text-sm text-muted-foreground">Our AI will analyze the image to extract member names and dates</p>
            </li>
            <li className="relative">
              <div className="absolute -left-[31px] h-6 w-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-secondary">3</span>
              </div>
              <h4 className="font-medium text-base">Review & Confirm</h4>
              <p className="text-sm text-muted-foreground">You'll be able to review and edit the extracted information before proceeding</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}