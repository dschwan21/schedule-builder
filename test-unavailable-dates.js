const { generateSchedules, isSameDay } = require('./lib/utils');

console.log("🧪 Running unavailable dates enforcement test...");

// Test that members are never scheduled on dates they marked as unavailable
function testUnavailableDatesStrict() {
  // Setup test data - 5 members, each unavailable on a different week over 5 weeks
  const members = [
    { id: 1, name: "Member 1", unavailableDates: ["2025-04-05"] },
    { id: 2, name: "Member 2", unavailableDates: ["2025-04-12"] },
    { id: 3, name: "Member 3", unavailableDates: ["2025-04-19"] },
    { id: 4, name: "Member 4", unavailableDates: ["2025-04-26"] },
    { id: 5, name: "Member 5", unavailableDates: ["2025-05-03"] }
  ];
  
  const lessonDates = [
    "2025-04-05",
    "2025-04-12",
    "2025-04-19",
    "2025-04-26",
    "2025-05-03"
  ];
  
  const constraints = {
    maxGroupSize: 4,
    minGroupSize: 2,
    strictMinSize: true,
    mixGroups: true
  };
  
  console.log("\nSpecific test case: 5 members, 5 weeks, each misses one different week");
  console.log("\nGenerating schedules for following test data:");
  console.log("- 5 Members with varying availability");
  console.log("- 5 Lesson dates: Apr 5, Apr 12, Apr 19, Apr 26, May 3");
  console.log("- Min group size: 2, Max group size: 4");
  
  // Report which members are unavailable on which dates
  lessonDates.forEach(date => {
    const unavailableMembers = members.filter(member => 
      member.unavailableDates.some(ud => 
        isSameDay(new Date(ud), new Date(date))
      )
    );
    
    console.log(`\nDate ${date}: ${unavailableMembers.length} members unavailable`);
    unavailableMembers.forEach(member => {
      console.log(`  - ${member.name} is unavailable`);
    });
  });
  
  console.log("\nGenerating schedules...");
  // Generate schedules
  const schedules = generateSchedules(members, lessonDates, constraints);
  
  // Verification: No member should be scheduled on a date they're unavailable
  let passedTests = true;
  let violations = [];
  
  schedules.forEach((schedule, scheduleIndex) => {
    console.log(`\nAnalyzing Schedule ${scheduleIndex + 1}:`);
    
    // For each date in the schedule
    lessonDates.forEach(date => {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      // Get groups on this date
      const groupsOnDate = schedule.lessonGroups.filter(group => 
        isSameDay(new Date(group.date), new Date(date))
      );
      
      // Count members assigned on this date
      const totalAssigned = groupsOnDate.reduce(
        (sum, group) => sum + group.members.length, 0
      );
      
      // Get unassigned members for this date
      const unassigned = schedule.unassignedMembersByDate[formattedDate] || [];
      
      console.log(`Date ${date}:`);
      console.log(`- ${groupsOnDate.length} groups with ${totalAssigned} total members assigned`);
      console.log(`- ${unassigned.length} members unassigned`);
      
      // Check: should have 4 members assigned (1 is unavailable for each date)
      if (totalAssigned !== 4) {
        console.log(`❌ WARNING: Expected 4 members on ${date}, but found ${totalAssigned}`);
      }
      
      // For each group on this date
      groupsOnDate.forEach((group, groupIndex) => {
        console.log(`  Group ${groupIndex + 1}: ${group.members.map(m => m.name).join(', ')}`);
        
        // Check each member in the group
        group.members.forEach(member => {
          // Find the full member object with unavailable dates
          const fullMember = members.find(m => m.id === member.id);
          
          // Check if this member is supposed to be unavailable on this date
          const isUnavailable = fullMember.unavailableDates.some(ud => 
            isSameDay(new Date(ud), new Date(date))
          );
          
          if (isUnavailable) {
            passedTests = false;
            const violation = `❌ Schedule ${scheduleIndex + 1}, Date ${date}: ${member.name} was scheduled despite being unavailable`;
            violations.push(violation);
            console.log(`    ${violation}`);
          }
        });
      });
    });
  });
  
  // Report results
  console.log("\n-------------------------------------------");
  if (passedTests) {
    console.log("✅ PASSED: All unavailable date constraints were properly enforced");
    console.log("    No member was scheduled on a date they marked as unavailable.");
  } else {
    console.log("❌ FAILED: Some members were scheduled on dates they marked as unavailable:");
    violations.forEach(violation => console.log(`   ${violation}`));
  }
  
  return passedTests;
}

// Run the test
testUnavailableDatesStrict();