'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatDate } from '../../../lib/utils';
import { use } from 'react';

export default function ScheduleDetailPage({ params }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    // In a real app, you would fetch the specific schedule from a database
    // For now, we'll use mock data
    const mockSchedule = {
      id: 'schedule-1',
      name: 'April Lessons',
      createdAt: '2025-03-15T14:30:00Z',
      lessonGroups: [
        {
          date: '2025-04-08',
          time: '4:00 PM - 5:30 PM',
          members: [
            { id: 1, name: 'Alice Smith' },
            { id: 3, name: 'Carol Williams' },
            { id: 4, name: 'David Brown' }
          ]
        },
        {
          date: '2025-04-15',
          time: '4:00 PM - 5:30 PM',
          members: [
            { id: 2, name: 'Bob Johnson' },
            { id: 3, name: 'Carol Williams' },
            { id: 4, name: 'David Brown' }
          ]
        },
        {
          date: '2025-04-22',
          time: '4:00 PM - 5:30 PM',
          members: [
            { id: 1, name: 'Alice Smith' },
            { id: 2, name: 'Bob Johnson' },
            { id: 3, name: 'Carol Williams' },
            { id: 4, name: 'David Brown' }
          ]
        }
      ]
    };
    
    // Simulate API call
    setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDisplayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPDF = () => {
    // This would be implemented with a PDF generation library in a real app
    alert('PDF download functionality would be implemented here');
  };
  
  const handleShareSchedule = () => {
    if (navigator.share) {
      navigator.share({
        title: schedule?.name,
        text: 'Check out our tennis lesson schedule!',
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold mb-4">Schedule Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The schedule you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/schedules"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Schedules
          </Link>
        </div>
      </div>
    );
  }

  // Group lesson groups by date
  const groupedByDate = schedule.lessonGroups.reduce((acc, group) => {
    const dateKey = group.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(group);
    return acc;
  }, {});

  // Enhance the mock data to include available members who are not attending
  if (schedule) {
    // Get all unique dates
    const allDates = Array.from(
      new Set(schedule.lessonGroups.map(group => group.date))
    ).sort();
    
    // Get all unique members across all lesson groups
    const allMembers = Array.from(
      new Set(schedule.lessonGroups.flatMap(group => group.members.map(m => m.name)))
    ).sort();
    
    // Add mock availability data
    schedule.memberAvailability = {};
    
    // For each date and member, create availability status
    allDates.forEach(date => {
      schedule.memberAvailability[date] = {};
      
      allMembers.forEach(memberName => {
        // Check if member is attending on this date
        const isAttending = schedule.lessonGroups.some(group => 
          group.date === date && group.members.some(m => m.name === memberName)
        );
        
        // Randomly assign 'AVAILABLE' status to some non-attending members
        const isAvailable = isAttending ? true : Math.random() > 0.3;
        
        schedule.memberAvailability[date][memberName] = isAttending 
          ? 'ATTENDING' 
          : isAvailable 
            ? 'AVAILABLE' 
            : 'UNAVAILABLE';
      });
    });
  }

  // Get all unique members for attendance tracking
  const allMembers = Array.from(
    new Set(schedule.lessonGroups.flatMap(group => group.members.map(m => m.name)))
  ).sort();
  
  // Get all unique dates for the schedule
  const allDates = Array.from(
    new Set(schedule.lessonGroups.map(group => group.date))
  ).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 print:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <Link 
            href="/schedules" 
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Schedules
          </Link>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            
            <button 
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            
            <button 
              onClick={handleShareSchedule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </header>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden print:shadow-none">
          <div className="bg-blue-600 text-white p-6 print:bg-blue-100 print:text-blue-900">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">{schedule.name}</h1>
                <p className="text-blue-100 dark:text-blue-200 print:text-blue-700 mt-1">
                  Created on {new Date(schedule.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-white/10 print:bg-white px-4 py-2 rounded-lg print:border print:border-blue-200">
                <p className="text-sm font-medium">Tennis Lesson Schedule</p>
              </div>
            </div>
          </div>
          
          {/* Members list */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Members
            </h2>
            <div className="flex flex-wrap gap-2">
              {allMembers.map(name => (
                <span key={name} className="inline-flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>
          
          {/* Grid Style Schedule */}
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Lesson Schedule
            </h2>
            
            <div className="w-full overflow-x-auto my-8">
              <style jsx>{`
                table {
                  border-collapse: separate;
                  border-spacing: 0;
                  width: 100%;
                  border: 3px solid #9ca3af;
                  table-layout: fixed;
                }
                
                th, td {
                  border: 2px solid #9ca3af;
                  padding: 12px;
                }
                
                th {
                  background-color: #e5e7eb;
                  font-weight: bold;
                  color: #111827;
                  height: 60px;
                }
                
                tr:nth-child(even) {
                  background-color: #f9fafb;
                }
                
                tr:nth-child(odd) {
                  background-color: #ffffff;
                }
                
                @media (prefers-color-scheme: dark) {
                  table {
                    border-color: #4b5563;
                  }
                  
                  th, td {
                    border-color: #4b5563;
                  }
                  
                  th {
                    background-color: #374151;
                    color: #e5e7eb;
                  }
                  
                  tr:nth-child(even) {
                    background-color: #1f2937;
                  }
                  
                  tr:nth-child(odd) {
                    background-color: #111827;
                  }
                }
              `}</style>
              
              <table>
                <thead>
                  <tr>
                    <th style={{width: '200px'}} className="text-left">
                      Date
                    </th>
                    {allMembers.map(member => (
                      <th key={member} style={{width: `${100 / (allMembers.length + 1)}%`, textAlign: 'center'}}>
                        {member}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allDates.map((date, dateIndex) => {
                    // Get time from the first group with this date
                    const group = schedule.lessonGroups.find(g => g.date === date);
                    const time = group?.time || ''; 
                    
                    return (
                      <tr key={date} style={{height: '80px'}}>
                        <td className="font-medium text-left" style={{verticalAlign: 'middle'}}>
                          <div className="text-base">{formatDisplayDate(date)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{time}</div>
                        </td>
                        
                        {allMembers.map(member => {
                          const status = schedule.memberAvailability[date][member];
                          
                          let bgColor, textColor;
                          if (status === 'ATTENDING') {
                            bgColor = '#bbf7d0'; // light green
                            textColor = '#166534'; // dark green
                          } else if (status === 'AVAILABLE') {
                            bgColor = '#dbeafe'; // light blue
                            textColor = '#1e40af'; // dark blue
                          } else {
                            bgColor = '#fee2e2'; // light red
                            textColor = '#991b1b'; // dark red
                          }
                          
                          return (
                            <td 
                              key={`${date}-${member}`} 
                              style={{
                                backgroundColor: bgColor,
                                color: textColor,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                verticalAlign: 'middle'
                              }}
                            >
                              {status}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Status Legend */}
            <div className="my-8 flex flex-wrap gap-8 justify-center border-2 border-gray-400 dark:border-gray-600 p-6 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div style={{
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: '#bbf7d0',
                  border: '2px solid #9ca3af', 
                  display: 'inline-block'
                }}></div>
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">ATTENDING - Scheduled to attend</span>
              </div>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: '#dbeafe',
                  border: '2px solid #9ca3af', 
                  display: 'inline-block'
                }}></div>
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">AVAILABLE - Can attend (backup)</span>
              </div>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: '#fee2e2',
                  border: '2px solid #9ca3af', 
                  display: 'inline-block'
                }}></div>
                <span className="text-base font-medium text-gray-700 dark:text-gray-300">UNAVAILABLE - Cannot attend</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 print:bg-white print:pt-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                This schedule is provided by the Tennis Lesson Schedule Builder.
              </p>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm print:text-gray-800">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 print:hidden">
          <Link
            href="/schedules/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Schedule
          </Link>
        </div>
      </div>
    </div>
  );
}