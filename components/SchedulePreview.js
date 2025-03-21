'use client';

import { useState } from 'react';
import { formatDate } from '../lib/utils';

export default function SchedulePreview({ schedules, onSaveSchedule, fullPage = false }) {
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  
  const currentSchedule = schedules[currentScheduleIndex];
  
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
        <div className="flex items-center justify-between mb-6">
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
                    Group {groupIndex + 1}
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