'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if we have a saved schedule in localStorage
    const savedScheduleStr = localStorage.getItem('savedSchedule');
    
    let allSchedules = [];
    
    // If we have a saved schedule, parse it and add it to our schedules list
    if (savedScheduleStr) {
      try {
        const savedSchedule = JSON.parse(savedScheduleStr);
        
        // Format the saved schedule for display
        const formattedSchedule = {
          id: savedSchedule.id || `schedule-${new Date().getTime()}`,
          name: 'Tennis Clinic Schedule',
          createdAt: savedSchedule.savedAt || new Date().toISOString(),
          lessonGroups: savedSchedule.lessonGroups || []
        };
        
        // Ensure the lessonGroups are properly formatted
        if (formattedSchedule.lessonGroups.length > 0) {
          console.log("First lesson group sample:", formattedSchedule.lessonGroups[0]);
        }
        
        allSchedules.push(formattedSchedule);
        console.log('Loaded saved schedule from localStorage:', formattedSchedule);
      } catch (error) {
        console.error('Error parsing saved schedule:', error);
      }
    }
    
    // Add the mock schedule as a fallback or additional schedule
    const mockSchedule = {
      id: 'schedule-1',
      name: 'April Lessons',
      createdAt: '2025-03-15T14:30:00Z',
      lessonGroups: [
        {
          date: '2025-04-08',
          members: [
            { id: 1, name: 'Alice Smith' },
            { id: 3, name: 'Carol Williams' },
            { id: 4, name: 'David Brown' }
          ]
        },
        {
          date: '2025-04-15',
          members: [
            { id: 2, name: 'Bob Johnson' },
            { id: 3, name: 'Carol Williams' },
            { id: 4, name: 'David Brown' }
          ]
        },
        {
          date: '2025-04-22',
          members: [
            { id: 1, name: 'Alice Smith' },
            { id: 2, name: 'Bob Johnson' },
            { id: 3, name: 'Carol Williams' },
            { id: 4, name: 'David Brown' }
          ]
        }
      ]
    };
    
    // Only add the mock schedule if we don't have a saved schedule
    // and we're in development mode (not needed for regular use)
    if (allSchedules.length === 0 && false) {
      allSchedules.push(mockSchedule);
    }
    
    setSchedules(allSchedules);
    setLoading(false);
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
            
            <h1 className="text-2xl font-bold">Your Schedules</h1>
            
            <Link 
              href="/schedules/create"
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Create New
            </Link>
          </div>
        </header>
        
        <main>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-6">
              {schedules.map(schedule => (
                <div key={schedule.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{schedule.name}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Created on {formatDate(schedule.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      
                      <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-slate-700 dark:text-slate-200 mb-2">Lesson Dates:</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(schedule.lessonGroups.map(g => g.date))).map(date => (
                        <span key={date} className="inline-flex items-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-sm rounded-full px-3 py-1">
                          {formatDate(date)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-slate-700 dark:text-slate-200 mb-2">Members:</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(schedule.lessonGroups.flatMap(g => g.members.map(m => m.name)))).map(name => (
                        <span key={name} className="inline-flex items-center bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full px-3 py-1">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href={schedule.id === 'schedule-1' ? `/schedules/${schedule.id}` : `/schedules/schedule-latest`}
                      className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-800 dark:hover:text-emerald-300"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              
              <h2 className="text-xl font-bold mb-2">No schedules yet</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Create your first tennis lesson schedule to get started.
              </p>
              
              <Link
                href="/schedules/create"
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Create New Schedule
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}