'use client';

import { useState } from 'react';
import { formatDate } from '../lib/utils';

export default function SchedulePreview({ schedules, onSaveSchedule }) {
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Schedule Options</h2>
      
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handlePrevSchedule}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="text-center">
          <span className="font-medium">Option {currentScheduleIndex + 1} of {schedules.length}</span>
        </div>
        
        <button
          type="button"
          onClick={handleNextSchedule}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-8 mb-8">
        {Object.entries(groupedByDate).map(([date, groups]) => (
          <div key={date} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 font-medium">
              {new Date(date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg"
                >
                  <h4 className="font-medium mb-2 text-emerald-800 dark:text-emerald-200">
                    Group {groupIndex + 1}
                  </h4>
                  
                  <ul className="space-y-1">
                    {group.members.map((member, memberIndex) => (
                      <li key={memberIndex} className="flex items-center gap-2">
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
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={handleSaveSchedule}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Use This Schedule
        </button>
      </div>
    </div>
  );
}