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
        
        // Pass the extracted data to the parent component
        onProcessImage(extractedData);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process the image. Please try again with a clearer image.');
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
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <div className="space-y-4">
            <img 
              src={image} 
              alt="Uploaded schedule" 
              className="max-h-64 mx-auto object-contain rounded-md"
            />
            
            {processing ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
                <p className="text-muted-foreground">
                  Processing image with AI...
                  <br />
                  <span className="text-sm">This may take a few moments</span>
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="button-secondary"
              >
                Remove Image
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            <div>
              <p className="text-muted-foreground mb-2">
                Drag & drop your schedule image here, or
              </p>
              
              <label className="inline-block button-primary cursor-pointer">
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
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-medium text-base mb-2">Tips for best results:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Ensure your image is clear and well-lit</li>
          <li>Make sure names and dates are clearly visible</li>
          <li>Tables, spreadsheets, and calendars work best</li>
          <li>For handwritten schedules, ensure the writing is legible</li>
        </ul>
      </div>
      
      <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            After processing, you'll have a chance to review and edit the extracted information.
          </span>
        </div>
      </div>
    </div>
  );
}