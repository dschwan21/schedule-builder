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
    id: 'clinic-dates', 
    label: 'Clinic Dates',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )
  },
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
    id: 'unavailable-dates', 
    label: 'Unavailable Dates',
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
    id: 'schedule', 
    label: 'Schedule',
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
  const [step, setStep] = useState('clinic-dates');
  // Old input mode that was removed but might be referenced
  const inputMode = 'manual';
  const [members, setMembers] = useState([]);
  const [numMembers, setNumMembers] = useState(0);
  const [clinicDates, setClinicDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState({});
  const [constraints, setConstraints] = useState({ 
    maxGroupSize: 4, 
    mixGroups: true,
    comments: '' 
  });
  const [schedules, setSchedules] = useState([]);
  
  // Handle clinic dates selection
  const handleSelectClinicDates = (selectedDates) => {
    setClinicDates(selectedDates);
    setStep('members');
  };
  
  // Handle setting number of members and creating member slots
  const handleSetMemberCount = (count) => {
    setNumMembers(count);
    
    // Create empty member slots
    const newMembers = Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: '',
      unavailableDates: []
    }));
    
    setMembers(newMembers);
  };
  
  // Handle adding members
  const handleAddMembers = (newMembers) => {
    // Update members with names
    setMembers(prevMembers => {
      return newMembers.map((newMember, index) => {
        // Preserve existing unavailable dates if they exist
        const existingMember = prevMembers.find(m => m.id === newMember.id);
        return {
          ...newMember,
          unavailableDates: existingMember?.unavailableDates || []
        };
      });
    });
    
    setStep('unavailable-dates');
  };
  
  // Handle unavailable dates selection
  const handleSelectUnavailableDates = (memberUnavailability) => {
    setUnavailableDates(memberUnavailability);
    
    // Update member objects with their unavailable dates
    const updatedMembers = members.map(member => {
      const memberDates = memberUnavailability[member.id] || [];
      return {
        ...member,
        unavailableDates: memberDates
      };
    });
    
    setMembers(updatedMembers);
    setStep('constraints');
  };
  
  // Handle constraint setup
  const handleSetConstraints = (newConstraints) => {
    setConstraints(newConstraints);
    
    // Generate schedule permutations based on inputs
    const generatedSchedules = generateSchedules(members, clinicDates, newConstraints);
    setSchedules(generatedSchedules);
    
    setStep('schedule');
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
      case 'clinic-dates':
        return <CalendarPicker 
                 key="clinic-dates-calendar"
                 title="Select Clinic Dates" 
                 description="Select the dates when lessons will be held" 
                 onSelectDates={handleSelectClinicDates} 
                 fullPage={true}
               />;
      
      case 'members':
        return (
          <div className="card p-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              Add Members
            </h2>
            
            {numMembers === 0 ? (
              <div className="card p-6 border-2 border-border/50 mb-8">
                <h3 className="font-medium text-lg mb-4">How many members will participate?</h3>
                <div className="flex items-center gap-4 mb-6">
                  <input 
                    type="number" 
                    min="1" 
                    max="20" 
                    className="input w-full text-lg" 
                    placeholder="Enter number of members" 
                    onChange={(e) => setNumMembers(parseInt(e.target.value) || 0)}
                    value={numMembers || ''}
                  />
                </div>
                <button 
                  className="button button-primary"
                  disabled={numMembers < 1}
                  onClick={() => handleSetMemberCount(numMembers)}
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <MemberInput 
                key="member-input"
                initialMembers={members} 
                onAddMembers={handleAddMembers} 
                showUnavailability={false}
              />
            )}
          </div>
        );
      
      case 'unavailable-dates':
        // Debug members data
        console.log("Members passed to unavailable-dates calendar:", members);
        
        return <CalendarPicker 
                 key="unavailable-dates-calendar"
                 title="Select Unavailable Dates" 
                 description="For each member, select lesson dates they cannot attend (only lesson dates can be selected)" 
                 onSelectDates={handleSelectUnavailableDates} 
                 fullPage={true}
                 multiMember={true}
                 members={members.length > 0 ? members : [{ id: 1, name: "Member 1", unavailableDates: [] }]}
                 allowedDates={clinicDates} // Only allow selection of clinic dates for unavailability
               />;
      
      case 'constraints':
        return <ConstraintInput 
                 key="constraint-input"
                 onSetConstraints={handleSetConstraints} 
                 hasAIComments={true}
               />;
      
      case 'schedule':
        return <SchedulePreview 
                 key="schedule-preview"
                 schedules={schedules.length > 0 ? schedules : [
                   { 
                     lessonGroups: [
                       { 
                         date: new Date().toISOString().split('T')[0],
                         members: members.slice(0, 4)
                       }
                     ] 
                   }
                 ]} 
                 onSaveSchedule={handleSaveSchedule} 
                 fullPage={true}
               />;
      
      default:
        return null;
    }
  };
  
  // Calculate the current step index
  const currentStepIndex = STEPS.findIndex(s => s.id === step);
  
  // Get the active steps (all steps are active in this flow)
  const activeSteps = STEPS;
  
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
          <div className="relative mb-12">
            <div className="overflow-hidden h-2 mb-8 bg-muted/50 rounded-full shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all ease-out duration-500 shadow-lg" 
                style={{ width: `${((currentStepIndex + 1) / activeSteps.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between relative z-10">
              {activeSteps.map((stepItem, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div 
                    key={stepItem.id}
                    className="flex flex-col items-center"
                  >
                    <div className={`
                      h-14 w-14 rounded-full flex items-center justify-center mb-3
                      transition-all duration-500 
                      ${isCurrent 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-110 ring-4 ring-primary/20' 
                        : isCompleted
                          ? 'bg-primary text-white shadow-md'
                          : isActive 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted/80 text-muted-foreground'
                      }
                    `}>
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="h-6 w-6">
                          {stepItem.icon}
                        </div>
                      )}
                    </div>
                    <span className={`
                      text-sm font-semibold transition-colors
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
        
        <main className="min-h-[500px] w-full">
          {renderStep()}
        </main>
      </div>
    </div>
  );
}