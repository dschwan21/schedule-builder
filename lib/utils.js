/**
 * Generates combinations of members for lessons based on availability and constraints
 * 
 * @param {Array} members - Array of member objects with names and availability
 * @param {Array} lessonDates - Array of dates when lessons will occur
 * @param {Object} constraints - Constraints like min/max group size and enforcement options
 * @returns {Array} - Array of possible schedule permutations
 */
export function generateSchedules(members, lessonDates, constraints) {
  console.log("Generating schedules with the following inputs:");
  console.log(`- ${members.length} members`);
  console.log(`- ${lessonDates.length} lesson dates`);
  
  // Validate constraints
  const { 
    maxGroupSize = 4, 
    minGroupSize = 2, 
    strictMinSize = true, 
    mixGroups = true 
  } = constraints;
  
  console.log("Constraints:");
  console.log(`- Max group size: ${maxGroupSize}`);
  console.log(`- Min group size: ${minGroupSize}`);
  console.log(`- Strict min size: ${strictMinSize}`);
  console.log(`- Mix groups: ${mixGroups}`);
  
  // Validate member data
  let dataErrors = false;
  members.forEach((member, index) => {
    if (!member.name) {
      console.error(`Member at index ${index} is missing a name`);
      dataErrors = true;
    }
    
    if (!Array.isArray(member.unavailableDates)) {
      console.error(`Member ${member.name || index} has invalid unavailableDates: ${typeof member.unavailableDates}`);
      dataErrors = true;
      // Fix the data to prevent errors
      member.unavailableDates = [];
    }
  });
  
  if (dataErrors) {
    console.warn("Data errors detected. Schedule may not be accurate.");
  }
  
  const schedules = [];
  
  // For each lesson date, find available members
  const availableMembersByDate = lessonDates.map(date => {
    // Ensure date is in YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Add more robust date validation and member filtering
    const availableMembers = [];
    const unavailableMembers = [];

    for (const member of members) {
      // Default to available
      let isAvailable = true;
      
      // Safety check for missing unavailableDates
      if (!member.unavailableDates || !Array.isArray(member.unavailableDates)) {
        console.error(`Warning: Member ${member.name} has invalid unavailableDates:`, member.unavailableDates);
        member.unavailableDates = []; // Fix the structure
      }
      
      // Check each unavailable date
      for (const unavailableDate of member.unavailableDates) {
        try {
          if (isSameDay(new Date(unavailableDate), new Date(date))) {
            isAvailable = false;
            unavailableMembers.push(member);
            break;
          }
        } catch (error) {
          console.error(`Error comparing dates for member ${member.name}:`, error);
          console.error(`  Date: ${date}, Unavailable date: ${unavailableDate}`);
        }
      }
      
      if (isAvailable) {
        availableMembers.push(member);
      }
    }
    
    return {
      date: formattedDate,
      members: availableMembers
    };
  });
  
  // Generate different permutations
  for (let variation = 0; variation < 3; variation++) {
    const schedule = {
      id: `schedule-${variation + 1}`,
      lessonGroups: [],
      unassignedMembersByDate: {} // Track unassigned members by date
    };
    
    // Track interaction history to optimize variety between groups
    let memberInteractionHistory = {};
    
    availableMembersByDate.forEach(({ date, members: availableMembers }, dateIndex) => {
      // Initialize member history for tracking interactions
      if (dateIndex === 0) {
        // For the first date, we have no history yet
        availableMembers.forEach(member => {
          memberInteractionHistory[member.id] = {};
        });
      }
      
      // For the first variation, simple assignment optimizing for balance
      // For variations 2 and 3, optimize for different groupings
      let groups = [];
      const unassignedMembers = [];
      
      if (variation === 0 || !mixGroups) {
        // Simple balanced grouping for first variation
        // Shuffle members differently for each variation
        let shuffledMembers = shuffleArray([...availableMembers], variation + dateIndex + 1);
        
        // First pass: create full groups
        for (let i = 0; i < shuffledMembers.length; i += maxGroupSize) {
          const groupMembers = shuffledMembers.slice(i, i + maxGroupSize);
          
          // Check if we have enough members for a valid group
          if (groupMembers.length >= minGroupSize) {
            groups.push({
              members: groupMembers,
              date
            });
          } else {
            // Not enough members for a complete group
            unassignedMembers.push(...groupMembers);
          }
        }
      } else {
        // Use optimized grouping for other variations, considering interaction history
        const optimizedMemberGroups = createOptimizedGroups(
          availableMembers, 
          memberInteractionHistory, 
          minGroupSize, 
          maxGroupSize
        );
        
        // Convert to the required format
        groups = optimizedMemberGroups.map(memberGroup => ({
          members: memberGroup,
          date
        }));
        
        // Find unassigned members (not included in any group)
        const assignedIds = new Set();
        groups.forEach(group => {
          group.members.forEach(member => {
            assignedIds.add(member.id);
          });
        });
        
        // Any member not assigned to a group is unassigned
        availableMembers.forEach(member => {
          if (!assignedIds.has(member.id)) {
            unassignedMembers.push(member);
          }
        });
      }
      
      // Handle unassigned members after group creation
      if (!strictMinSize && unassignedMembers.length > 0) {
        // In non-strict mode, we distribute unassigned members to existing groups
        // or create undersized groups if needed
        
        // First, try to create a full-sized group if possible
        if (unassignedMembers.length >= minGroupSize) {
          // We have enough for a minimum-sized group
          const groupMembers = unassignedMembers.splice(0, Math.min(maxGroupSize, unassignedMembers.length));
          groups.push({
            members: groupMembers,
            date
          });
        }
        
        // Now distribute any remaining members to existing groups
        if (unassignedMembers.length > 0 && groups.length > 0) {
          // Sort groups by size (smallest first) to balance them
          groups.sort((a, b) => a.members.length - b.members.length);
          
          // Add each unassigned member to the smallest group
          for (const member of unassignedMembers) {
            // Re-sort groups each time to ensure we're always adding to the smallest
            groups.sort((a, b) => a.members.length - b.members.length);
            
            // Only add to groups that aren't already at max size
            if (groups[0].members.length < maxGroupSize) {
              groups[0].members.push(member);
            } else {
              // All groups are at max size, create a new undersized group
              groups.push({
                members: [member],
                date
              });
            }
          }
          
          // Clear unassigned since they've all been assigned
          unassignedMembers.length = 0;
        } else if (unassignedMembers.length > 0) {
          // No groups exist yet, create a new one even if under minimum size
          groups.push({
            members: unassignedMembers,
            date
          });
          // Clear unassigned since they've all been assigned
          unassignedMembers.length = 0;
        }
      } else if (unassignedMembers.length >= minGroupSize) {
        // In strict mode, only create a new group if we have enough for minimum size
        groups.push({
          members: unassignedMembers,
          date
        });
        // Clear unassigned since they've been assigned
        unassignedMembers.length = 0;
      }
      
      // Update member interaction history for future dates
      groups.forEach(group => {
        // For each pair of members in the group, record that they interacted
        for (let i = 0; i < group.members.length; i++) {
          const member1 = group.members[i];
          
          if (!memberInteractionHistory[member1.id]) {
            memberInteractionHistory[member1.id] = {};
          }
          
          for (let j = i + 1; j < group.members.length; j++) {
            const member2 = group.members[j];
            
            if (!memberInteractionHistory[member2.id]) {
              memberInteractionHistory[member2.id] = {};
            }
            
            // Increment interaction count in both directions
            memberInteractionHistory[member1.id][member2.id] = (memberInteractionHistory[member1.id][member2.id] || 0) + 1;
            memberInteractionHistory[member2.id][member1.id] = (memberInteractionHistory[member2.id][member1.id] || 0) + 1;
          }
        }
      });
      
      // Store any remaining unassigned members
      if (unassignedMembers.length > 0) {
        if (!schedule.unassignedMembersByDate[date]) {
          schedule.unassignedMembersByDate[date] = [];
        }
        schedule.unassignedMembersByDate[date].push(...unassignedMembers);
      }
      
      schedule.lessonGroups.push(...groups);
    });
    
    schedules.push(schedule);
  }
  
  return schedules;
}

/**
 * Checks if two dates are the same day, accounting for timezone differences
 * This function ensures that date comparison works correctly across different formats
 * (YYYY-MM-DD, MM/DD/YYYY, etc.) and handles timezone offsets properly.
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) {
    console.error("Invalid date comparison:", date1, date2);
    return false;
  }
  
  try {
    // Normalize dates to ensure consistent comparison
    const normalizeDate = (date) => {
      // If already a Date object
      if (date instanceof Date) {
        return date;
      }
      
      // If it's a string
      if (typeof date === 'string') {
        // Handle various formats
        if (date.includes('T')) {
          // ISO format with time
          return new Date(date);
        } else if (date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
          // YYYY-MM-DD format
          const [year, month, day] = date.split('-').map(Number);
          return new Date(year, month - 1, day);
        } else if (date.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
          // MM/DD/YYYY format
          const [month, day, year] = date.split('/').map(Number);
          return new Date(year, month - 1, day);
        }
      }
      
      // Default fallback
      return new Date(date);
    };
    
    const d1 = normalizeDate(date1);
    const d2 = normalizeDate(date2);
    
    // Compare year, month, and day components
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch (error) {
    console.error("Error comparing dates:", error, date1, date2);
    return false;
  }
}

/**
 * Shuffles an array using Fisher-Yates algorithm with seed for reproducibility
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
 * Creates optimized groups to maximize variety between lessons
 * Uses member interaction history to try to put members with people they haven't played with
 * 
 * @param {Array} members - Array of available members for this date
 * @param {Object} memberHistory - Past groupings history to inform current grouping
 * @param {number} minSize - Minimum group size
 * @param {number} maxSize - Maximum group size
 * @returns {Array} - Array of grouped members
 */
function createOptimizedGroups(members, memberHistory = {}, minSize, maxSize) {
  // Initialize member history if not provided
  if (!memberHistory) {
    memberHistory = {};
    members.forEach(member => {
      memberHistory[member.id] = {};
    });
  }
  
  // Create a copy of members to work with
  const remainingMembers = [...members];
  const groups = [];
  
  // If we don't have enough members for even one group, return all together
  if (remainingMembers.length <= maxSize) {
    if (remainingMembers.length >= minSize) {
      return [remainingMembers];
    } else {
      return remainingMembers.length > 0 ? [remainingMembers] : [];
    }
  }
  
  // Calculate how many groups we need and their optimal sizes
  // In strict mode, we need to ensure all groups are at least minSize
  // Calculate the maximum number of full-sized groups we can create
  const maxPossibleGroups = Math.floor(remainingMembers.length / minSize);
  const numGroups = Math.min(maxPossibleGroups, Math.ceil(remainingMembers.length / maxSize));
  
  // Calculate optimal size for each group
  const optimalSize = Math.floor(remainingMembers.length / (numGroups || 1));
  const extraMembers = remainingMembers.length % (numGroups || 1);
  
  // Initialize empty groups
  for (let i = 0; i < numGroups; i++) {
    groups.push([]);
  }
  
  // Function to calculate a score for putting a member in a group
  // Lower score is better (fewer previous interactions)
  const scoreForGroup = (member, group) => {
    if (!memberHistory[member.id]) return 0;
    
    let score = 0;
    for (const existingMember of group) {
      // Look up history between these members
      const interactionCount = memberHistory[member.id][existingMember.id] || 0;
      score += interactionCount;
    }
    return score;
  };
  
  // For each member, find the best group based on past interaction history
  while (remainingMembers.length > 0) {
    // Find groups that still need members
    const availableGroups = groups
      .map((group, index) => ({group, index}))
      .filter(({group}) => {
        const targetSize = optimalSize + (group.length < extraMembers ? 1 : 0);
        return group.length < targetSize;
      });
    
    if (availableGroups.length === 0) break;
    
    // Select a random member to assign
    const memberIndex = Math.floor(Math.random() * remainingMembers.length);
    const member = remainingMembers[memberIndex];
    
    // Find the group with the lowest interaction score for this member
    let bestGroupIndex = 0;
    let lowestScore = Infinity;
    
    for (const {group, index} of availableGroups) {
      const score = scoreForGroup(member, group);
      if (score < lowestScore) {
        lowestScore = score;
        bestGroupIndex = index;
      }
    }
    
    // Add the member to the best group
    groups[bestGroupIndex].push(member);
    
    // Remove the member from remaining
    remainingMembers.splice(memberIndex, 1);
  }
  
  // Filter out any groups that don't meet the minimum size
  // When using strict enforcement, we should only return groups that meet the minimum size
  const validGroups = groups.filter(group => group.length >= minSize);
  
  // Return only valid groups - members in groups smaller than minSize will become "unassigned"
  return validGroups;
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

/**
 * Processes image data and extracts member information using AI
 * @param {string} imageBase64 - Base64 encoded image data
 * @returns {Promise<Object>} - Extracted member data and dates
 */
export async function processImageWithAI(imageBase64) {
  try {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    const response = await fetch('/api/extract-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Data }),
    });
    
    if (!response.ok) {
      throw new Error(`AI processing failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing image with AI:', error);
    throw error;
  }
}

/**
 * Processes text data and extracts member information using AI
 * @param {string} text - Text containing schedule information
 * @returns {Promise<Object>} - Extracted member data and dates
 */
export async function processTextWithAI(text) {
  try {
    const response = await fetch('/api/extract-text-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error(`AI text processing failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing text with AI:', error);
    throw error;
  }
}