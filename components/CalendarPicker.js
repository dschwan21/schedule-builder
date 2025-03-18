'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '../lib/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPicker({ onSelectDates }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [animation, setAnimation] = useState('fade'); // For month transition animation
  
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
    
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter(d => d !== dateString));
    } else {
      setSelectedDates([...selectedDates, dateString]);
    }
  };
  
  const handleContinue = () => {
    if (selectedDates.length > 0) {
      onSelectDates(selectedDates);
    }
  };

  // Create calendar days for the current month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create array of calendar days
    const days = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, dayOfMonth: '' });
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ 
        date, 
        dayOfMonth: i, 
        isToday: isToday(date),
        isSelected: selectedDates.includes(formatDate(date))
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
  
  return (
    <div className="card p-8 animate-slide-up">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <div className="h-8 w-8 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        Select Lesson Dates
      </h2>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button" 
            onClick={handlePrevMonth}
            className="button-outline p-0 w-10 h-10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h3 className="font-medium text-xl relative overflow-hidden px-4 py-2">
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
            className="button-outline p-0 w-10 h-10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className={`grid grid-cols-7 gap-2 transition-all duration-150 ${
          animation === 'slide-left' ? 'opacity-0 -translate-x-4' : 
          animation === 'slide-right' ? 'opacity-0 translate-x-4' : ''
        }`}>
          {DAYS.map(day => (
            <div key={day} className="text-center font-medium py-2 text-sm text-muted-foreground">
              {day}
            </div>
          ))}
          
          {getDaysInMonth().map((day, index) => (
            <div key={index} className="aspect-square">
              {day.date ? (
                <button
                  type="button"
                  onClick={() => handleDateClick(day.date)}
                  className={`w-full h-full flex items-center justify-center rounded-full text-sm transition-all duration-200
                    ${day.isToday ? 'ring-2 ring-secondary' : ''}
                    ${day.isSelected 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                      : 'hover:bg-muted dark:hover:bg-muted/50'
                    }
                    ${day.isSelected ? 'scale-110' : 'scale-100'}
                  `}
                >
                  {day.dayOfMonth}
                </button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border pt-6 space-y-4">
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Selected Dates ({selectedDates.length})
          </h3>
          
          {selectedDates.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedDates.map(date => (
                <div 
                  key={date} 
                  className="inline-flex items-center bg-primary/10 dark:bg-primary/20 text-primary text-sm rounded-full px-3 py-1.5 animate-slide-up"
                >
                  <span>{new Date(date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDates(selectedDates.filter(d => d !== date))}
                    className="ml-2 text-primary/70 hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 text-muted-foreground mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>No dates selected. Click on dates in the calendar to select lesson days.</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2">
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
            onClick={handleContinue}
            disabled={selectedDates.length === 0}
            className="button-primary group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}