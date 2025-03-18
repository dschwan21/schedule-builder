/**
 * Generates combinations of members for lessons based on availability
 * 
 * @param {Array} members - Array of member objects with names and availability
 * @param {Array} lessonDates - Array of dates when lessons will occur
 * @param {Object} constraints - Constraints like max group size
 * @returns {Array} - Array of possible schedule permutations
 */
export function generateSchedules(members, lessonDates, constraints) {
  const { maxGroupSize = 4 } = constraints;
  const schedules = [];
  
  // For each lesson date, find available members
  const availableMembersByDate = lessonDates.map(date => {
    return {
      date,
      members: members.filter(member => 
        !member.unavailableDates.some(unavailableDate => 
          isSameDay(new Date(unavailableDate), new Date(date))
        )
      )
    };
  });
  
  // Generate different permutations
  // This is a simple implementation - can be improved with more advanced algorithms
  for (let variation = 0; variation < 3; variation++) {
    const schedule = {
      id: `schedule-${variation + 1}`,
      lessonGroups: []
    };
    
    availableMembersByDate.forEach(({ date, members: availableMembers }) => {
      // Shuffle members differently for each variation
      const shuffledMembers = shuffleArray([...availableMembers], variation);
      
      // Create groups of maxGroupSize
      const groups = [];
      for (let i = 0; i < shuffledMembers.length; i += maxGroupSize) {
        groups.push({
          members: shuffledMembers.slice(i, i + maxGroupSize),
          date
        });
      }
      
      schedule.lessonGroups.push(...groups);
    });
    
    schedules.push(schedule);
  }
  
  return schedules;
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray(array, seed = 1) {
  const newArray = [...array];
  let currentIndex = newArray.length;
  let temporaryValue, randomIndex;
  
  // Seed-based pseudorandom generator
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  while (currentIndex !== 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    
    temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }
  
  return newArray;
}

/**
 * Formats a date as MM/DD/YYYY
 */
export function formatDate(date) {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${month}/${day}/${year}`;
}