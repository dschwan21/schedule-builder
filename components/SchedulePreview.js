'use client';

import { useState } from 'react';
import { formatDate } from '../lib/utils';

export default function SchedulePreview({ schedules, onSaveSchedule, fullPage = false, constraints }) {
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  
  // Handle empty schedules array
  if (!schedules || schedules.length === 0) {
    return (
      <div className="card p-8 animate-slide-up">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </div>
          Schedule Generation
        </h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-medium mb-2 text-yellow-800 dark:text-yellow-300">Unable to Generate Schedule</h3>
              <p className="text-yellow-700 dark:text-yellow-400">
                No valid schedule could be generated with the current constraints and availability. 
                Try adjusting your group size constraints or member availability.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="button-secondary group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Constraints
          </button>
        </div>
      </div>
    );
  }
  
  const currentSchedule = schedules[currentScheduleIndex];
  
  // Get constraints information if passed
  const { minGroupSize, maxGroupSize, strictMinSize } = constraints || { 
    minGroupSize: 2, 
    maxGroupSize: 4, 
    strictMinSize: true
  };
  
  const handlePrevSchedule = () => {
    setCurrentScheduleIndex((prevIndex) => 
      prevIndex === 0 ? schedules.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextSchedule = () => {
    setCurrentScheduleIndex((prevIndex) => 
      prevIndex === schedules.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleSaveSchedule = () => {
    onSaveSchedule(currentSchedule);
  };
  
  // Group lesson groups by date for display
  const groupedByDate = currentSchedule.lessonGroups.reduce((acc, group) => {
    const dateKey = group.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(group);
    return acc;
  }, {});
  
  // Check if any unassigned members exist
  const hasUnassignedMembers = currentSchedule.unassignedMembersByDate && 
    Object.keys(currentSchedule.unassignedMembersByDate).length > 0;
  
  return (
    <div className={`card p-8 ${fullPage ? 'min-h-[85vh]' : ''} animate-slide-up`}>
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
        </div>
        Tennis Clinic Schedule
      </h2>
      
      <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-6 mb-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevSchedule}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <span className="font-medium">Schedule Option {currentScheduleIndex + 1} of {schedules.length}</span>
            </div>
            
            <button
              type="button"
              onClick={handleNextSchedule}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center border-t pt-4 border-emerald-100 dark:border-emerald-900/20">
            <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center gap-2">
              <span className="text-sm font-medium">Group Constraints:</span>
              <span className="text-sm bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                {minGroupSize}-{maxGroupSize} members
              </span>
            </div>
            
            {strictMinSize && (
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Strict minimum enforcement</span>
              </div>
            )}
            
            {hasUnassignedMembers && (
              <div className="px-4 py-2 bg-white bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-lg shadow-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">Some members could not be assigned due to constraints</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-8 mb-8">
        {Object.entries(groupedByDate).map(([date, groups]) => (
          <div key={date} className="border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 px-6 py-3 font-medium text-emerald-800 dark:text-emerald-200">
              {new Date(date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-emerald-100 dark:border-emerald-900/20 shadow-sm"
                >
                  <h4 className="font-medium mb-3 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">
                      {groupIndex + 1}
                    </span>
                    Group {groupIndex + 1} <span className="text-sm text-gray-500">({group.members.length} members)</span>
                  </h4>
                  
                  <ul className="space-y-2">
                    {group.members.map((member, memberIndex) => (
                      <li key={memberIndex} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span>{member.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {/* Show unassigned members if any */}
              {currentSchedule.unassignedMembersByDate && currentSchedule.unassignedMembersByDate[date] && currentSchedule.unassignedMembersByDate[date].length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-red-200 dark:border-red-900/20 shadow-sm">
                  <h4 className="font-medium mb-3 text-red-800 dark:text-red-300 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Unassigned Members
                  </h4>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    These members couldn't be assigned due to group size constraints.
                  </div>
                  
                  <ul className="space-y-2">
                    {currentSchedule.unassignedMembersByDate[date].map((member, memberIndex) => (
                      <li key={memberIndex} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span>{member.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between border-t border-border pt-6">
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
          type="button"
          onClick={handleSaveSchedule}
          className="button-primary group"
        >
          Save Schedule
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}