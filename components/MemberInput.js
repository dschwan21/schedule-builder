'use client';

import { useState, useRef, useEffect } from 'react';

export default function MemberInput({ initialMembers = [], onAddMembers, showUnavailability = true }) {
  const [members, setMembers] = useState(
    initialMembers.length > 0 
      ? initialMembers 
      : [{ id: 1, name: '', unavailableDates: [] }]
  );
  const [tempDate, setTempDate] = useState('');
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  
  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);
  
  const addMember = () => {
    setMembers([
      ...members,
      { id: members.length + 1, name: '', unavailableDates: [] }
    ]);
  };
  
  const removeMember = (id) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id));
    }
  };
  
  const updateMemberName = (id, name) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, name } : member
    ));
  };
  
  const openCalendar = (memberId) => {
    setActiveCalendar(memberId);
    setShowCalendar(true);
  };
  
  const addUnavailableDate = (memberId, dateString = null) => {
    // If dateString is provided, use that date
    const dateToAdd = dateString || tempDate;
    
    if (!dateToAdd) return;
    
    // Check if date already exists for this member
    const memberToUpdate = members.find(m => m.id === memberId);
    if (memberToUpdate && memberToUpdate.unavailableDates.includes(dateToAdd)) {
      return; // Date already added
    }
    
    setMembers(members.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            unavailableDates: [...member.unavailableDates, dateToAdd] 
          } 
        : member
    ));
    
    if (!dateString) {
      setTempDate('');
    }
  };
  
  const removeDate = (memberId, dateIndex) => {
    setMembers(members.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            unavailableDates: member.unavailableDates.filter((_, idx) => idx !== dateIndex) 
          } 
        : member
    ));
  };
  
  const handleCalendarDateClick = (date) => {
    if (!activeCalendar) return;
    
    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    addUnavailableDate(activeCalendar, formattedDate);
  };
  
  // Navigation for calendar
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Generate calendar days
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Get array of unavailable dates for active member
    const activeMember = members.find(m => m.id === activeCalendar);
    const unavailableDates = activeMember ? activeMember.unavailableDates : [];
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const isUnavailable = unavailableDates.includes(dateString);
      
      days.push({
        day: i,
        date: date,
        isUnavailable: isUnavailable
      });
    }
    
    return days;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const validMembers = members.filter(member => member.name.trim() !== '');
    
    if (validMembers.length > 0) {
      onAddMembers(validMembers);
    }
  };
  
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {members.map((member, index) => (
          <div 
            key={member.id} 
            className="card p-6 border-2 border-border/50 transition-all hover:border-primary/20 focus-within:border-primary/30 animate-slide-up"
            style={{ animationDelay: `${100 * index}ms` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-3 items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <h3 className="font-medium text-lg">Member Details</h3>
              </div>
              
              <button 
                type="button" 
                onClick={() => removeMember(member.id)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Remove member"
                disabled={members.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Member Name
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMemberName(member.id, e.target.value)}
                className="input w-full"
                placeholder="e.g. John Smith"
                required
              />
            </div>
            
            {showUnavailability && (
              <div className="relative">
                <label className="block text-sm font-medium mb-3">Unavailable Dates</label>
                
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <button
                      type="button"
                      onClick={() => openCalendar(member.id)}
                      className="input w-full flex items-center text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {tempDate ? new Date(tempDate).toLocaleDateString() : "Select a date..."}
                    </button>
                    
                    {/* Fallback date input for accessibility */}
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="sr-only"
                      aria-hidden="true"
                      tabIndex="-1"
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => addUnavailableDate(member.id)}
                    className="button button-primary"
                    disabled={!tempDate}
                  >
                    Add Date
                  </button>
                </div>
                
                {/* Calendar Dropdown */}
                {showCalendar && activeCalendar === member.id && (
                  <div 
                    ref={calendarRef}
                    className="absolute z-20 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-[400px]"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-6">
                        <button 
                          type="button" 
                          onClick={prevMonth}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        <h3 className="text-lg font-medium">
                          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        
                        <button 
                          type="button" 
                          onClick={nextMonth}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2">
                        {/* Days of week headers */}
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                          <div key={index} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                            {day}
                          </div>
                        ))}
                        
                        {/* Calendar days */}
                        {generateCalendarDays().map((day, index) => (
                          <div key={index} className="text-center py-1">
                            {day ? (
                              <button
                                type="button"
                                onClick={() => handleCalendarDateClick(day.date)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-base focus:outline-none
                                  ${day.isUnavailable 
                                    ? 'bg-blue-500 text-white' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                              >
                                {day.day}
                              </button>
                            ) : (
                              <span className="w-10 h-10"></span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setShowCalendar(false)}
                          className="text-sm font-medium px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          Close
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date();
                            const year = today.getFullYear();
                            const month = String(today.getMonth() + 1).padStart(2, '0');
                            const day = String(today.getDate()).padStart(2, '0');
                            const todayString = `${year}-${month}-${day}`;
                            
                            setTempDate(todayString);
                            addUnavailableDate(member.id, todayString);
                          }}
                          className="text-sm font-medium px-3 py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {member.unavailableDates.length > 0 ? (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Unavailable on:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.unavailableDates.map((date, index) => (
                        <div key={index} className="inline-flex items-center bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm">
                          <span>{new Date(date).toLocaleDateString()}</span>
                          <button 
                            type="button" 
                            onClick={() => removeDate(member.id, index)}
                            className="ml-2 text-blue-500 hover:text-red-500 transition-colors"
                            aria-label="Remove date"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No unavailable dates selected. This member will be available for all lessons.</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex items-center justify-between pt-4">
          <button 
            type="button" 
            onClick={addMember}
            className="button button-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Member
          </button>
          
          <button 
            type="submit"
            className="button button-primary"
            disabled={members.every(m => !m.name.trim())}
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}