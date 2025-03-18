'use client';

import { useState } from 'react';

export default function MemberInput({ onAddMembers }) {
  const [members, setMembers] = useState([
    { id: 1, name: '', unavailableDates: [] }
  ]);
  const [tempDate, setTempDate] = useState('');
  
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
  
  const addUnavailableDate = (memberId) => {
    if (!tempDate) return;
    
    setMembers(members.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            unavailableDates: [...member.unavailableDates, tempDate] 
          } 
        : member
    ));
    
    setTempDate('');
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">Unavailable Dates</label>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="input flex-1"
                />
                
                <button 
                  type="button" 
                  onClick={() => addUnavailableDate(member.id)}
                  className="button-primary"
                >
                  Add Date
                </button>
              </div>
              
              {member.unavailableDates.length > 0 ? (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {member.unavailableDates.map((date, index) => (
                      <div key={index} className="inline-flex items-center bg-muted/70 dark:bg-muted/50 px-3 py-1.5 rounded-full text-sm group">
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <button 
                          type="button" 
                          onClick={() => removeDate(member.id, index)}
                          className="ml-2 text-muted-foreground hover:text-red-500 transition-colors"
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
          </div>
        ))}
        
        <div className="flex items-center justify-between pt-4">
          <button 
            type="button" 
            onClick={addMember}
            className="button-secondary group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Member
          </button>
          
          <button 
            type="submit"
            className="button-primary group"
            disabled={members.every(m => !m.name.trim())}
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}