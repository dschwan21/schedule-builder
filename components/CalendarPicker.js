'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '../lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPicker({ 
  onSelectDates, 
  title = "Select Dates", 
  description = "", 
  fullPage = false,
  multiMember = false,
  members = [],
  allowedDates = [] // New prop to restrict available dates selection
}) {
  console.log("CalendarPicker Props:", { 
    title, description, fullPage, multiMember, 
    membersCount: members?.length || 0,
    allowedDatesCount: allowedDates?.length || 0
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [animation, setAnimation] = useState('fade'); // For month transition animation
  const [activeMember, setActiveMember] = useState(null);
  const [memberDateSelections, setMemberDateSelections] = useState({});
  // Initialize member date selections if in multiMember mode
  useEffect(() => {
    if (multiMember && members && members.length > 0) {
      console.log("Initializing member date selections for", members.length, "members");
      const initialSelections = {};
      members.forEach(member => {
        initialSelections[member.id] = member.unavailableDates || [];
      });
      setMemberDateSelections(initialSelections);
      setActiveMember(members[0]?.id);
    } else if (multiMember) {
      console.log("No members provided to CalendarPicker's multiMember mode");
    }
  }, [multiMember, members]);
  
  const handlePrevMonth = () => {
    setAnimation('slide-right');
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
      setAnimation('fade');
    }, 150);
  };
  
  const handleNextMonth = () => {
    setAnimation('slide-left');
    setTimeout(() => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
      setAnimation('fade');
    }, 150);
  };
  
  const handleDateClick = (date) => {
    const dateString = formatDate(date);
    console.log(`Clicked date ${dateString}, multiMember: ${multiMember}, activeMember: ${activeMember}`);
    
    if (multiMember && activeMember !== null) {
      // In multi-member mode, manage dates for the active member
      const memberDates = memberDateSelections[activeMember] || [];
      console.log(`Current dates for member ${activeMember}:`, memberDates);
      
      if (memberDates.includes(dateString)) {
        // Remove date
        const newDates = memberDates.filter(d => d !== dateString);
        console.log(`Removing date ${dateString} for member ${activeMember}, new dates:`, newDates);
        
        setMemberDateSelections(prev => ({
          ...prev,
          [activeMember]: newDates
        }));
      } else {
        // Add date
        const newDates = [...memberDates, dateString];
        console.log(`Adding date ${dateString} for member ${activeMember}, new dates:`, newDates);
        
        setMemberDateSelections(prev => ({
          ...prev,
          [activeMember]: newDates
        }));
      }
      
      // Force a re-render to update the calendar UI immediately
      setTimeout(() => {
        const updatedDays = getDaysInMonth();
        console.log("Calendar days updated after date click", updatedDays.filter(d => d.isSelected).map(d => d.dayOfMonth));
      }, 10);
    } else {
      // Standard single selection mode
      let newSelectedDates;
      if (selectedDates.includes(dateString)) {
        newSelectedDates = selectedDates.filter(d => d !== dateString);
        console.log(`Removing date ${dateString} from selection, new dates:`, newSelectedDates);
      } else {
        newSelectedDates = [...selectedDates, dateString];
        console.log(`Adding date ${dateString} to selection, new dates:`, newSelectedDates);
      }
      setSelectedDates(newSelectedDates);
      
      // Force a re-render to update the calendar UI immediately
      setTimeout(() => {
        console.log("After setting new selectedDates:", newSelectedDates);
      }, 10);
    }
  };
  
  const handleContinue = () => {
    if (multiMember) {
      if (Object.keys(memberDateSelections).length > 0) {
        onSelectDates(memberDateSelections);
      }
    } else {
      if (selectedDates.length > 0) {
        onSelectDates(selectedDates);
      }
    }
  };
  
  const handleSelectMember = (memberId) => {
    setActiveMember(memberId);
  };

  // Create calendar days for the current month with proper week alignment
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Calculate days from previous month to fill first week
    const previousMonthLastDay = new Date(year, month, 0).getDate();
    
    // Create array of calendar days
    const days = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = previousMonthLastDay - firstDayOfWeek + i + 1;
      days.push({ 
        date: null, 
        dayOfMonth: prevMonthDay,
        isPreviousMonth: true
      });
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDate(date);
      
      let isSelected = false;
      
      if (multiMember && activeMember !== null) {
        // Check if the date is selected for the active member
        const memberDates = memberDateSelections[activeMember] || [];
        isSelected = memberDates.includes(dateString);
      } else {
        // Standard selection check
        isSelected = selectedDates.includes(dateString);
      }
      
      days.push({ 
        date, 
        dayOfMonth: i, 
        isToday: isToday(date),
        isSelected: isSelected,
        isCurrentMonth: true
      });
    }
    
    // Fill in remaining days from next month to complete the grid (up to 42 slots for 6 weeks)
    const totalDaysToShow = 42; // 6 weeks * 7 days
    const remainingDays = totalDaysToShow - days.length;
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ 
        date: null, 
        dayOfMonth: i,
        isNextMonth: true
      });
    }
    
    return days;
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Render the selected dates list based on mode
  const renderSelectedDatesList = () => {
    if (multiMember && activeMember) {
      // Show selected dates for active member in multi-member mode
      const memberDates = memberDateSelections[activeMember] || [];
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-3xl mx-auto w-full">
          <h3 className="font-semibold text-xl mb-5 flex items-center gap-2 text-gray-800 dark:text-gray-200 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Unavailable Dates ({memberDates.length})
          </h3>
          
          {memberDates.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
              {memberDates.map(date => (
                <div 
                  key={date} 
                  className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-base rounded-lg px-4 py-2.5 shadow-sm"
                >
                  <span>{new Date(date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMemberDateSelections({
                        ...memberDateSelections,
                        [activeMember]: memberDateSelections[activeMember].filter(d => d !== date)
                      });
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 p-5 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-gray-700 dark:text-gray-300 mb-4 shadow-inner max-w-lg mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-base">No unavailable dates selected for this member.</span>
            </div>
          )}
        </div>
      );
    } else {
      // Standard single selection mode
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-3xl mx-auto w-full">
          <h3 className="font-semibold text-xl mb-5 flex items-center gap-2 text-gray-800 dark:text-gray-200 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Selected Dates ({selectedDates.length})
          </h3>
          
          {selectedDates.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
              {selectedDates.map(date => (
                <div 
                  key={date} 
                  className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-base rounded-lg px-4 py-2.5 shadow-sm"
                >
                  <span>{new Date(date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDates(selectedDates.filter(d => d !== date))}
                    className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 p-5 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-gray-700 dark:text-gray-300 mb-4 shadow-inner max-w-lg mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-base">No dates selected. Click on dates in the calendar to select lesson days.</span>
            </div>
          )}
        </div>
      );
    }
  };

  // Render the member selection tabs if in multi-member mode
  const renderMemberTabs = () => {
    if (!multiMember || !members || members.length <= 0) {
      console.log("Not rendering member tabs:", { multiMember, membersLength: members?.length || 0 });
      return null;
    }
    
    // If no active member is set but we have members, set the first one as active
    if (activeMember === null && members.length > 0) {
      console.log("No active member set, selecting first member", members[0].id);
      setTimeout(() => setActiveMember(members[0].id), 0);
      return null; // Return null for first render before active member is set
    }
    
    console.log("Rendering member tabs for", members.length, "members, active:", activeMember);
    
    return (
      <div className="mb-6 border-b border-border">
        <ul className="flex overflow-x-auto -mb-px">
          {members.map(member => (
            <li key={member.id} className="mr-2">
              <button
                type="button"
                onClick={() => handleSelectMember(member.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  border-b-2 rounded-t-lg ${activeMember === member.id 
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-muted-foreground/30'
                  }`}
              >
                <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {member.id}
                </span>
                {member.name || `Member ${member.id}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Calculate continue button state
  const isContinueDisabled = multiMember 
    ? Object.values(memberDateSelections).every(dates => dates.length === 0)
    : selectedDates.length === 0;
  
  return (
    <div className={`card ${fullPage ? 'min-h-[85vh]' : ''} p-4 md:p-8 animate-slide-up bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center`}>
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3 text-center justify-center">
        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        {title}
      </h2>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-2xl mx-auto">{description}</p>
      )}
      
      {renderMemberTabs()}
      
      {/* Selected date count indicator for active member */}
      {multiMember && activeMember && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            {memberDateSelections[activeMember]?.length || 0} dates selected for {members.find(m => m.id === activeMember)?.name || `Member ${activeMember}`}
          </div>
        </div>
      )}
      
      <div className={`${fullPage ? 'flex-1 mb-8' : 'mb-8'} max-w-5xl mx-auto`}>
        <div className="flex items-center justify-between mb-6 py-4 max-w-md mx-auto">
          <button 
            type="button" 
            onClick={handlePrevMonth}
            className="flex items-center justify-center p-3 bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors shadow-sm"
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h3 className="font-bold text-2xl md:text-3xl relative overflow-hidden px-6 text-gray-800 dark:text-white">
            <div className={`transition-all duration-150 ${
              animation === 'slide-left' ? 'opacity-0 -translate-x-4' : 
              animation === 'slide-right' ? 'opacity-0 translate-x-4' : ''
            }`}>
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
          </h3>
          
          <button 
            type="button" 
            onClick={handleNextMonth}
            className="flex items-center justify-center p-3 bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors shadow-sm"
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className={`max-w-5xl mx-auto p-6 bg-blue-50 dark:bg-gray-800/50 rounded-2xl shadow-lg transition-all duration-150 flex flex-col items-center ${
          animation === 'slide-left' ? 'opacity-0 -translate-x-4' : 
          animation === 'slide-right' ? 'opacity-0 translate-x-4' : ''
        }`}>
          {/* Legend to explain what the calendar indicators mean */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-4 flex flex-wrap gap-4 justify-center items-center text-sm">
            <div className="flex items-center gap-2">
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                backgroundColor: '#22c55e', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>1</div>
              <span>{multiMember ? "Lesson Date" : "Selected Date"}</span>
            </div>
            {multiMember && (
              <div className="flex items-center gap-2">
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>1</div>
                <span>Unavailable Date</span>
              </div>
            )}
            {multiMember && (
              <div className="flex items-center gap-2">
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  backgroundColor: '#f3f4f6',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: '0.5',
                  textDecoration: 'line-through'
                }}>1</div>
                <span>Non-Lesson Date (Disabled)</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                backgroundColor: 'white',
                color: '#333333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '2px solid #3b82f6'
              }}>1</div>
              <span>Today</span>
            </div>
          </div>

          <table className="w-full max-w-4xl border-collapse bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
            {/* Calendar header with day names */}
            <thead>
              <tr>
                {DAYS.map(day => (
                  <th key={day} className="text-center font-semibold py-5 text-base md:text-lg dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 bg-blue-100 dark:bg-blue-900/30">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Calendar body with weeks properly arranged in rows */}
            <tbody>
              {Array.from({ length: 6 }).map((_, weekIndex) => (
                <tr key={`week-${weekIndex}`}>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex;
                    const day = getDaysInMonth()[dayNumber];
                    
                    return (
                      <td key={`day-${dayNumber}`} className="text-center h-20 md:h-24 p-1 relative border border-gray-100 dark:border-gray-700">
                        {day.isCurrentMonth && day.date ? (
                          (() => {
                            // Format this date to check if it's allowed
                            const dateString = formatDate(day.date);
                            const isAllowedDate = !allowedDates.length || allowedDates.includes(dateString);
                            
                            // If we're in multiMember mode and have restricted dates, only allow selection of those dates
                            const isSelectable = !multiMember || isAllowedDate;
                            
                            if (isSelectable) {
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleDateClick(day.date)}
                                  style={{
                                    width: '4rem',
                                    height: '4rem',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    fontSize: '1.125rem',
                                    fontWeight: '500',
                                    transition: 'all 200ms',
                                    backgroundColor: day.isSelected 
                                      ? (multiMember ? '#ef4444' : '#22c55e')  // Red or Green
                                      : '#ffffff',
                                    color: day.isSelected ? '#ffffff' : '#333333',
                                    boxShadow: day.isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                    border: day.isToday ? '2px solid #3b82f6' : 'none',
                                  }}
                                  onMouseOver={() => console.log("Date hover:", formatDate(day.date), "Selected:", day.isSelected)}
                                >
                                  {day.dayOfMonth}
                                </button>
                              );
                            } else {
                              // For non-allowed dates in multiMember mode, show as disabled
                              return (
                                <span style={{
                                  width: '4rem',
                                  height: '4rem',
                                  borderRadius: '9999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  margin: '0 auto',
                                  fontSize: '1.125rem',
                                  fontWeight: '500',
                                  opacity: '0.5',
                                  backgroundColor: '#f3f4f6',
                                  color: '#9ca3af',
                                  textDecoration: 'line-through'
                                }}>
                                  {day.dayOfMonth}
                                </span>
                              );
                            }
                          })()
                        ) : (
                          <span style={{
                            width: '4rem',
                            height: '4rem',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '1.125rem',
                            color: '#9ca3af',
                            opacity: '0.5'
                          }}>
                            {day.dayOfMonth}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6 max-w-5xl mx-auto flex flex-col items-center w-full">
        {renderSelectedDatesList()}
        
        <div className="flex justify-between items-center pt-4 max-w-lg mx-auto w-full">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-4 bg-white hover:bg-gray-100 text-gray-700 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 rounded-xl transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <button
            type="button"
            onClick={handleContinue}
            disabled={isContinueDisabled}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}