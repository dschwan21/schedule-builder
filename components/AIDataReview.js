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
    <div className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-xl p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-3">
        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-700 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        Review Extracted Data
      </h2>
      
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Our AI has analyzed your schedule image. Please review the extracted information below, make any necessary edits, and confirm when ready.
      </p>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary relative"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Processing Your Data</h3>
          <p className="text-muted-foreground text-center">
            We're preparing the extracted information<br />for your review. This will only take a moment...
          </p>
        </div>
      ) : (
        <>
          {showLessonDates && (
            <div className="mb-10 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-8 animate-slide-up shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Extracted Lesson Dates
                </h3>
                
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-sm font-medium py-1 px-3 rounded-full">
                  {lessonDates.length} {lessonDates.length === 1 ? 'Date' : 'Dates'}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {lessonDates.length > 0 ? (
                    lessonDates.map((date, idx) => (
                      <div 
                        key={idx} 
                        className="inline-flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{new Date(date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric'
                        })}</span>
                        <button 
                          type="button" 
                          onClick={() => removeLessonDate(date)}
                          className="ml-2 text-blue-600 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-70 group-hover:opacity-100"
                          aria-label="Remove date"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 w-full bg-slate-100 dark:bg-slate-700 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-slate-600 dark:text-slate-300">No lesson dates detected</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">Add New Lesson Date</label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                    onChange={(e) => addLessonDate(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md border border-blue-700 shadow-sm transition-colors duration-200 flex items-center group"
                    onClick={(e) => {
                      const input = e.target.previousSibling;
                      if (input.value) {
                        addLessonDate(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:rotate-90 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Date
                  </button>
                </div>
                
                <div className="mt-4 flex items-start gap-2 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600 dark:text-slate-300">These dates will be used for scheduling lessons. You can add or remove dates as needed.</span>
                </div>
              </div>
            </div>
          )}
        
          <div className="space-y-6 mt-10 max-h-[650px] overflow-y-auto pr-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                Extracted Members
              </h3>
              
              <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm font-medium py-1 px-3 rounded-full">
                {members.length} {members.length === 1 ? 'Member' : 'Members'}
              </span>
            </div>
            
            {members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 focus-within:border-purple-400 dark:focus-within:border-purple-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-slide-up"
                    style={{ animationDelay: `${100 * index}ms` }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-700 dark:to-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-200 font-bold text-lg mr-4 shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMemberName(member.id, e.target.value)}
                          className="w-full font-semibold text-lg bg-transparent border-none focus:ring-0 p-0 focus:outline-none border-b-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-slate-800 dark:text-slate-100"
                          placeholder="Member Name"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-full mb-3 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Unavailable Dates
                      </label>
                      
                      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                        {member.unavailableDates && member.unavailableDates.length > 0 ? (
                          member.unavailableDates.map((date, idx) => (
                            <div key={idx} className="inline-flex items-center bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-sm group hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                              <span>{new Date(date).toLocaleDateString()}</span>
                              <button 
                                type="button" 
                                onClick={() => removeDate(member.id, date)}
                                className="ml-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-60 group-hover:opacity-100"
                                aria-label="Remove date"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 px-3 py-1.5">No unavailable dates detected</p>
                        )}
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <label className="block text-xs font-medium mb-2 text-slate-700 dark:text-slate-300">Add Unavailable Date</label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-200 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            onChange={(e) => addUnavailableDate(member.id, e.target.value)}
                          />
                          <button
                            type="button"
                            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-md border border-purple-700 shadow-sm transition-colors duration-200 flex items-center group"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              if (input.value) {
                                addUnavailableDate(member.id, input.value);
                                input.value = '';
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 w-full bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-400 dark:text-slate-500 mb-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <p className="text-slate-600 dark:text-slate-300 text-lg">No members detected</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 mt-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
                <h3 className="font-semibold flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  AI Extraction Complete
                </h3>
                <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>
                      Found <span className="font-medium text-slate-800 dark:text-slate-200">{members.length} members</span> with <span className="font-medium text-slate-800 dark:text-slate-200">{members.reduce((acc, m) => acc + (m.unavailableDates?.length || 0), 0)} unavailable dates</span>
                    </span>
                  </div>
                  
                  {showLessonDates && (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>
                        Extracted <span className="font-medium text-slate-800 dark:text-slate-200">{lessonDates.length} lesson dates</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onEditManually}
                  className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Manually
                </button>
                
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg border border-emerald-700 shadow-sm transition-colors duration-200 flex items-center group relative overflow-hidden"
                >
                  <div className="flex items-center group-hover:translate-x-[-4px] transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Confirm & Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-white/10 translate-y-[100%] group-hover:translate-y-[0%] transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-600 dark:text-slate-300">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2">About AI Data Extraction</h4>
            <p className="leading-relaxed">
              Our AI has analyzed your schedule to identify members and their unavailable dates. 
              The accuracy depends on the image clarity and format structure. 
              Please review the information above carefully and make any needed corrections before proceeding.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-slate-800 dark:text-slate-100">100% AI-Powered</span>
              <span className="mx-2 text-slate-400 dark:text-slate-500">|</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-slate-800 dark:text-slate-100">Private & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}