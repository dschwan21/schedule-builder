'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MemberInput from '../../../components/MemberInput';
import ImageUpload from '../../../components/ImageUpload';
import TextUpload from '../../../components/TextUpload';
import AIDataReview from '../../../components/AIDataReview';
import CalendarPicker from '../../../components/CalendarPicker';
import ConstraintInput from '../../../components/ConstraintInput';
import SchedulePreview from '../../../components/SchedulePreview';
import { generateSchedules } from '../../../lib/utils';

// Step indicators for the progress bar
const STEPS = [
  { 
    id: 'members', 
    label: 'Add Members',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    )
  },
  { 
    id: 'review',
    label: 'Review Data',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    id: 'dates', 
    label: 'Select Dates',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    id: 'constraints', 
    label: 'Set Constraints',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    )
  },
  { 
    id: 'preview', 
    label: 'Preview',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
      </svg>
    )
  }
];

export default function CreateSchedulePage() {
  const router = useRouter();
  const [step, setStep] = useState('members');
  const [members, setMembers] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [lessonDates, setLessonDates] = useState([]);
  const [constraints, setConstraints] = useState({ maxGroupSize: 4, mixGroups: true });
  const [schedules, setSchedules] = useState([]);
  const [inputMode, setInputMode] = useState('manual'); // 'manual', 'image', or 'text'
  
  // Handle adding members
  const handleAddMembers = (newMembers) => {
    setMembers(newMembers);
    setStep('dates');
  };
  
  // Handle image upload processing
  const handleProcessImage = (extractedData) => {
    setExtractedData(extractedData);
    setStep('review');
  };
  
  // Handle text upload processing
  const handleProcessText = (extractedData) => {
    setExtractedData(extractedData);
    
    // If lesson dates were also extracted, save them
    if (extractedData.lessonDates && extractedData.lessonDates.length > 0) {
      setLessonDates(extractedData.lessonDates);
    }
    
    setStep('review');
  };
  
  // Handle AI data review confirmation
  const handleReviewConfirm = (reviewedData) => {
    setMembers(reviewedData.members);
    
    // If lesson dates were extracted from text and already set, skip to constraints
    if (inputMode === 'text' && lessonDates.length > 0) {
      setStep('constraints');
    } else {
      setStep('dates');
    }
  };
  
  // Handle switch to manual mode from AI review
  const handleEditManually = () => {
    // Pre-populate manual input with the extracted data
    setMembers(extractedData?.members || []);
    setInputMode('manual');
    setStep('members');
  };
  
  // Handle date selection
  const handleSelectDates = (selectedDates) => {
    setLessonDates(selectedDates);
    setStep('constraints');
  };
  
  // Handle constraint setup
  const handleSetConstraints = (newConstraints) => {
    setConstraints(newConstraints);
    
    // Generate schedule permutations based on inputs
    const generatedSchedules = generateSchedules(members, lessonDates, newConstraints);
    setSchedules(generatedSchedules);
    
    setStep('preview');
  };
  
  // Handle saving a schedule
  const handleSaveSchedule = (schedule) => {
    // In a real app, you would save this to a database or localStorage
    console.log('Saving schedule:', schedule);
    
    // Navigate to the schedules page
    router.push('/schedules');
  };
  
  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 'members':
        return (
          <div>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center p-1 rounded-full bg-muted/70 shadow-sm">
                <button
                  type="button"
                  onClick={() => setInputMode('manual')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    inputMode === 'manual' 
                      ? 'bg-white dark:bg-card shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('image')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    inputMode === 'image' 
                      ? 'bg-white dark:bg-card shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    inputMode === 'text' 
                      ? 'bg-white dark:bg-card shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>
            
            {inputMode === 'image' ? (
              <ImageUpload onProcessImage={handleProcessImage} />
            ) : inputMode === 'text' ? (
              <TextUpload onProcessText={handleProcessText} />
            ) : (
              <MemberInput onAddMembers={handleAddMembers} />
            )}
          </div>
        );
      
      case 'review':
        return (
          <AIDataReview 
            extractedData={extractedData} 
            onConfirm={handleReviewConfirm}
            onEditManually={handleEditManually}
          />
        );
      
      case 'dates':
        return <CalendarPicker onSelectDates={handleSelectDates} />;
      
      case 'constraints':
        return <ConstraintInput onSetConstraints={handleSetConstraints} />;
      
      case 'preview':
        return <SchedulePreview schedules={schedules} onSaveSchedule={handleSaveSchedule} />;
      
      default:
        return null;
    }
  };
  
  // Get active steps based on flow (AI or manual)
  const getActiveSteps = () => {
    // For manual entry, skip the review step
    if (inputMode === 'manual' && step !== 'review') {
      return STEPS.filter(s => s.id !== 'review');
    }
    // For text entry that extracted dates, potentially skip dates step
    else if (inputMode === 'text' && lessonDates.length > 0 && step === 'review') {
      return STEPS.filter(s => s.id !== 'dates');
    }
    return STEPS;
  };
  
  // Calculate the current step index based on active steps
  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex(s => s.id === step);
  
  return (
    <div className="min-h-screen relative">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background to-muted overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="button-outline rounded-full p-0 w-10 h-10 flex items-center justify-center" aria-label="Back to home">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Create New Schedule
            </h1>
            
            <div className="w-10 h-10"></div> {/* Spacer for alignment */}
          </div>
          
          {/* Progress steps */}
          <div className="relative mb-10">
            <div className="overflow-hidden h-1.5 mb-5 bg-muted rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all ease-out duration-500" 
                style={{ width: `${((currentStepIndex + 1) / activeSteps.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between relative z-10">
              {activeSteps.map((stepItem, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div 
                    key={stepItem.id}
                    className="flex flex-col items-center"
                  >
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center mb-2
                      transition-all duration-300 
                      ${isCurrent 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-110' 
                        : isActive 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {stepItem.icon}
                    </div>
                    <span className={`
                      text-xs font-medium transition-colors
                      ${isActive 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                      }
                    `}>
                      {stepItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </header>
        
        <main className="min-h-[500px]">
          {renderStep()}
        </main>
      </div>
    </div>
  );
}