'use client';

import { useState, useCallback } from 'react';

export default function ImageUpload({ onProcessImage }) {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  
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
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    
    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    
    // In a real app, you would process the image with OCR here
    // For now, we'll just simulate the process
    setProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setProcessing(false);
      
      // Mock extracted data
      const extractedData = {
        members: [
          { id: 1, name: 'Alice Smith', unavailableDates: ['2025-04-15', '2025-04-22'] },
          { id: 2, name: 'Bob Johnson', unavailableDates: ['2025-04-08'] },
          { id: 3, name: 'Carol Williams', unavailableDates: [] },
          { id: 4, name: 'David Brown', unavailableDates: ['2025-04-29'] },
          { id: 5, name: 'Emma Davis', unavailableDates: ['2025-04-08', '2025-04-15'] }
        ]
      };
      
      onProcessImage(extractedData);
    }, 2000);
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Schedule Image</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragging 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-slate-300 dark:border-slate-600'
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
              className="max-h-64 mx-auto object-contain"
            />
            
            {processing ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-2"></div>
                <p className="text-slate-600 dark:text-slate-300">Processing image...</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Remove Image
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            <div>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                Drag & drop your schedule image here, or
              </p>
              
              <label className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 cursor-pointer">
                Browse Files
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload an image containing your tennis lesson schedule. We'll extract member names and availability.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <strong>Note:</strong> For best results, ensure your image is clear and contains a structured format with member names and dates.
        </p>
      </div>
    </div>
  );
}