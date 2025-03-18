'use client';

import { useState, useEffect } from 'react';

export default function AIDataReview({ extractedData, onConfirm, onEditManually }) {
  const [members, setMembers] = useState([]);
  const [lessonDates, setLessonDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLessonDates, setShowLessonDates] = useState(false);
  
  useEffect(() => {
    if (extractedData) {
      if (extractedData.members) {
        setMembers(extractedData.members);
      }
      
      if (extractedData.lessonDates && extractedData.lessonDates.length > 0) {
        setLessonDates(extractedData.lessonDates);
        setShowLessonDates(true);
      }
      
      setLoading(false);
    }
  }, [extractedData]);
  
  const updateMemberName = (id, name) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, name } : member
    ));
  };
  
  const addUnavailableDate = (memberId, date) => {
    if (!date) return;
    
    setMembers(members.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            unavailableDates: [...member.unavailableDates, date].filter((v, i, a) => a.indexOf(v) === i) 
          } 
        : member
    ));
  };
  
  const removeDate = (memberId, date) => {
    setMembers(members.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            unavailableDates: member.unavailableDates.filter(d => d !== date) 
          } 
        : member
    ));
  };
  
  const removeLessonDate = (date) => {
    setLessonDates(lessonDates.filter(d => d !== date));
  };
  
  const addLessonDate = (date) => {
    if (!date || lessonDates.includes(date)) return;
    setLessonDates([...lessonDates, date].sort());
  };
  
  const handleConfirm = () => {
    onConfirm({ 
      members,
      lessonDates
    });
  };
  
  return (
    <div className="card p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        Review Extracted Data
      </h2>
      
      <p className="text-muted-foreground mb-6">
        Our AI has analyzed your schedule image. Please review the extracted information below, make any necessary edits, and confirm when ready.
      </p>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading extracted data...</p>
        </div>
      ) : (
        <>
          {showLessonDates && (
            <div className="mb-8 bg-card border-2 border-border/50 rounded-xl p-6 animate-slide-up">
              <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Extracted Lesson Dates
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {lessonDates.length > 0 ? (
                  lessonDates.map((date, idx) => (
                    <div key={idx} className="inline-flex items-center bg-secondary/10 dark:bg-secondary/20 text-secondary px-3 py-1.5 rounded-full text-sm group">
                      <span>{new Date(date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <button 
                        type="button" 
                        onClick={() => removeLessonDate(date)}
                        className="ml-2 text-secondary/70 hover:text-red-500 transition-colors"
                        aria-label="Remove date"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No lesson dates detected</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="date"
                  className="input flex-1"
                  onChange={(e) => addLessonDate(e.target.value)}
                />
                <button
                  type="button"
                  className="button-secondary text-sm"
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    if (input.value) {
                      addLessonDate(input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add Lesson Date
                </button>
              </div>
              
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> These dates will be used for scheduling. You can add or remove dates here.
              </p>
            </div>
          )}
        
          <div className="space-y-6 mt-6 max-h-[500px] overflow-y-auto pr-2">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Extracted Members
            </h3>
            
            {members.map((member, index) => (
              <div 
                key={member.id} 
                className="card p-5 border-2 border-border/50 transition-all hover:border-primary/20 focus-within:border-primary/30 animate-slide-up"
                style={{ animationDelay: `${100 * index}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMemberName(member.id, e.target.value)}
                      className="font-medium text-lg bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:border-b-2 focus:border-primary"
                      placeholder="Member Name"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2">Unavailable Dates</label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {member.unavailableDates && member.unavailableDates.length > 0 ? (
                      member.unavailableDates.map((date, idx) => (
                        <div key={idx} className="inline-flex items-center bg-muted/70 dark:bg-muted/50 px-3 py-1.5 rounded-full text-sm group">
                          <span>{new Date(date).toLocaleDateString()}</span>
                          <button 
                            type="button" 
                            onClick={() => removeDate(member.id, date)}
                            className="ml-2 text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label="Remove date"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No unavailable dates detected</p>
                    )}
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <input
                      type="date"
                      className="input flex-1"
                      onChange={(e) => addUnavailableDate(member.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="button-secondary text-sm"
                      onClick={(e) => {
                        const input = e.target.previousSibling;
                        if (input.value) {
                          addUnavailableDate(member.id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Add Date
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-6 mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">AI Extraction Status</h3>
                <p className="text-sm text-muted-foreground">
                  Found {members.length} members with {members.reduce((acc, m) => acc + (m.unavailableDates?.length || 0), 0)} unavailable dates
                  {showLessonDates && ` and ${lessonDates.length} lesson dates`}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onEditManually}
                  className="button-secondary"
                >
                  Edit Manually
                </button>
                
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="button-primary"
                >
                  Confirm & Continue
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6 p-4 bg-accent/5 rounded-lg text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="font-medium block mb-1">About AI Data Extraction</span>
            <p>
              Our AI tries to identify members and their unavailable dates from your uploaded schedule. 
              The accuracy depends on the image quality and format. Feel free to make corrections before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}