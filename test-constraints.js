const { generateSchedules, isSameDay, formatDate } = require('./lib/utils');

// Unit tests for schedule generation and constraint enforcement
function runTests() {
  console.log("🧪 Running schedule constraint tests...");
  
  // Test the date comparison functionality
  testDateComparison();
  
  // Test unavailable dates constraint
  testUnavailableDatesEnforcement();
  
  // Test min/max group size constraints
  testGroupSizeConstraints();
  
  // Test strict minimum size enforcement
  testStrictMinSizeConstraint();
  
  console.log("\n✅ All tests completed");
}

// Test date comparison logic to ensure we're correctly identifying unavailable dates
function testDateComparison() {
  console.log("\n📋 Test: Date comparison functionality");
  
  // Test various date formats
  const testCases = [
    { date1: "2025-04-05", date2: "2025-04-05", shouldMatch: true },
    { date1: "2025-04-05", date2: "2025-04-06", shouldMatch: false },
    { date1: "2025-04-05", date2: "2025-4-5", shouldMatch: true },
    { date1: "2025-04-05", date2: "04/05/2025", shouldMatch: true },
    { date1: "2025-04-05", date2: "4/5/2025", shouldMatch: true },
    { date1: "2025-04-05", date2: new Date(2025, 3, 5), shouldMatch: true }, // JS months are 0-indexed
    { date1: "2025-04-05T12:00:00Z", date2: "2025-04-05", shouldMatch: true },
  ];
  
  let passedAll = true;
  
  testCases.forEach((testCase, index) => {
    const result = isSameDay(new Date(testCase.date1), new Date(testCase.date2));
    const passed = result === testCase.shouldMatch;
    
    console.log(`${passed ? '✅' : '❌'} Case ${index + 1}: ${testCase.date1} vs ${testCase.date2} - ${result ? 'Matched' : 'Did not match'} (${testCase.shouldMatch ? 'Should match' : 'Should not match'})`);
    
    if (!passed) {
      passedAll = false;
      console.log(`   Debug: Date 1: ${new Date(testCase.date1).toISOString()}, Date 2: ${new Date(testCase.date2).toISOString()}`);
    }
  });
  
  // Test with real member unavailability check
  const member = { 
    id: 1, 
    name: "Test Member", 
    unavailableDates: ["2025-04-05", "2025-04-10"] 
  };
  
  const dates = [
    "2025-04-05",
    "2025-04-06",
    "2025-04-10"
  ];
  
  console.log("\nMember unavailability check:");
  
  dates.forEach((date, index) => {
    const isUnavailable = member.unavailableDates.some(unavailableDate => 
      isSameDay(new Date(unavailableDate), new Date(date))
    );
    
    console.log(`Date ${date}: Member is ${isUnavailable ? 'unavailable' : 'available'}`);
    
    // Validate the result
    const expected = (date === "2025-04-05" || date === "2025-04-10");
    if (isUnavailable !== expected) {
      passedAll = false;
      console.log(`❌ Incorrect unavailability check for date ${date}. Expected: ${expected}, Got: ${isUnavailable}`);
    }
  });
  
  return passedAll;
}

// Test that unavailable dates are strictly enforced
function testUnavailableDatesEnforcement() {
  console.log("\n📋 Test: Unavailable dates constraint enforcement");
  
  // Setup test data
  const members = [
    { id: 1, name: "Alice", unavailableDates: ["2025-04-05"] },
    { id: 2, name: "Bob", unavailableDates: ["2025-04-10"] },
    { id: 3, name: "Charlie", unavailableDates: ["2025-04-15"] },
    { id: 4, name: "Dana", unavailableDates: [] },
    { id: 5, name: "Evan", unavailableDates: ["2025-04-05", "2025-04-15"] },
    { id: 6, name: "Fiona", unavailableDates: [] }
  ];
  
  const lessonDates = [
    "2025-04-05",
    "2025-04-10",
    "2025-04-15"
  ];
  
  const constraints = {
    maxGroupSize: 4,
    minGroupSize: 2,
    strictMinSize: true,
    mixGroups: true
  };
  
  // Generate schedules
  const schedules = generateSchedules(members, lessonDates, constraints);
  
  // Verification: No member should be scheduled on a date they're unavailable
  let passedTests = true;
  let violations = [];
  
  schedules.forEach((schedule, scheduleIndex) => {
    schedule.lessonGroups.forEach(group => {
      const date = group.date;
      group.members.forEach(member => {
        const isUnavailable = members
          .find(m => m.id === member.id)
          .unavailableDates.some(unavailableDate => 
            isSameDay(new Date(unavailableDate), new Date(date))
          );
        
        if (isUnavailable) {
          passedTests = false;
          violations.push(`❌ Schedule ${scheduleIndex + 1}: Member ${member.name} was scheduled on ${date} despite being unavailable`);
        }
      });
    });
  });
  
  // Report results
  if (passedTests) {
    console.log("✅ PASSED: All unavailable date constraints were properly enforced");
  } else {
    console.log("❌ FAILED: Some members were scheduled on dates they marked as unavailable:");
    violations.forEach(violation => console.log(`   ${violation}`));
  }
  
  return passedTests;
}

// Test that group size constraints are enforced
function testGroupSizeConstraints() {
  console.log("\n📋 Test: Group size constraint enforcement");
  
  // Setup test data
  const members = [];
  for (let i = 1; i <= 20; i++) {
    members.push({ 
      id: i, 
      name: `Member ${i}`, 
      unavailableDates: [] 
    });
  }
  
  const lessonDates = ["2025-04-05"];
  
  const constraints = {
    maxGroupSize: 4,
    minGroupSize: 3,
    strictMinSize: true,
    mixGroups: true
  };
  
  // Generate schedules
  const schedules = generateSchedules(members, lessonDates, constraints);
  
  // Verification: All groups should respect min/max group size
  let passedTests = true;
  let violations = [];
  
  schedules.forEach((schedule, scheduleIndex) => {
    schedule.lessonGroups.forEach((group, groupIndex) => {
      if (group.members.length > constraints.maxGroupSize) {
        passedTests = false;
        violations.push(`❌ Schedule ${scheduleIndex + 1}, Group ${groupIndex + 1}: Has ${group.members.length} members, exceeding maximum of ${constraints.maxGroupSize}`);
      }
      
      if (group.members.length < constraints.minGroupSize) {
        passedTests = false;
        violations.push(`❌ Schedule ${scheduleIndex + 1}, Group ${groupIndex + 1}: Has ${group.members.length} members, below minimum of ${constraints.minGroupSize}`);
      }
    });
  });
  
  // Report results
  if (passedTests) {
    console.log("✅ PASSED: All group size constraints were properly enforced");
  } else {
    console.log("❌ FAILED: Some groups violated size constraints:");
    violations.forEach(violation => console.log(`   ${violation}`));
  }
  
  return passedTests;
}

// Test that strict minimum size enforcement works correctly
function testStrictMinSizeConstraint() {
  console.log("\n📋 Test: Strict minimum size enforcement");
  
  // Setup test data - create a scenario where we can't make full groups
  const members = [];
  for (let i = 1; i <= 11; i++) { // 11 members can't be divided evenly into groups of 3+
    members.push({ 
      id: i, 
      name: `Member ${i}`, 
      unavailableDates: [] 
    });
  }
  
  const lessonDates = ["2025-04-05"];
  
  console.log("\nTest setup: 11 members, min group size = 3, max = 5, strict enforcement");
  // Test with strict enforcement ON
  const strictConstraints = {
    maxGroupSize: 5,
    minGroupSize: 3,
    strictMinSize: true,
    mixGroups: true
  };
  
  // Generate schedules with strict enforcement
  const strictSchedules = generateSchedules(members, lessonDates, strictConstraints);
  
  // Verification for strict mode: Should have unassigned members
  // We need to check if at least one of the schedule variations is correct
  let hasCorrectSchedule = false;
  let strictTestPassed = true;
  
  strictSchedules.forEach((schedule, scheduleIndex) => {
    const date = lessonDates[0];
    const unassignedForDate = schedule.unassignedMembersByDate[date] || [];
    
    console.log(`Schedule ${scheduleIndex + 1}:`);
    console.log(`- Groups: ${schedule.lessonGroups.length} with sizes: ${schedule.lessonGroups.map(g => g.members.length).join(', ')}`);
    console.log(`- Unassigned members: ${unassignedForDate.length}`);
    
    // Check if this schedule matches the expected pattern (3 groups of 3 with 2 unassigned)
    let thisScheduleCorrect = true;
    
    // Check unassigned count
    if (unassignedForDate.length !== 2) {
      thisScheduleCorrect = false;
      console.log(`  Schedule ${scheduleIndex + 1} doesn't have exactly 2 unassigned members`);
    }
    
    // Check min group size
    schedule.lessonGroups.forEach((group, groupIndex) => {
      if (group.members.length < strictConstraints.minGroupSize) {
        thisScheduleCorrect = false;
        console.log(`  Schedule ${scheduleIndex + 1} Group ${groupIndex + 1} is below minimum size`);
      }
    });
    
    // If this schedule is correct, mark it
    if (thisScheduleCorrect) {
      hasCorrectSchedule = true;
      console.log(`  ✅ Schedule ${scheduleIndex + 1} is correctly enforcing constraints`);
    }
  });
  
  // The test passes if at least one schedule variation is correct
  strictTestPassed = hasCorrectSchedule;
  
  if (!strictTestPassed) {
    console.log(`❌ Strict enforcement test failed: No schedule correctly had 3 groups of size 3 with 2 unassigned members`);
  }
  
  // Test with strict enforcement OFF
  const nonStrictConstraints = {
    maxGroupSize: 5,
    minGroupSize: 3,
    strictMinSize: false,
    mixGroups: true
  };
  
  // Generate schedules without strict enforcement
  const nonStrictSchedules = generateSchedules(members, lessonDates, nonStrictConstraints);
  
  // Verification for non-strict mode: All members should be assigned
  let hasCorrectNonStrictSchedule = false;
  let nonStrictTestPassed = true;
  
  nonStrictSchedules.forEach((schedule, scheduleIndex) => {
    const date = lessonDates[0];
    const unassignedForDate = schedule.unassignedMembersByDate[date] || [];
    
    console.log(`Non-strict Schedule ${scheduleIndex + 1}:`);
    console.log(`- Groups: ${schedule.lessonGroups.length} with sizes: ${schedule.lessonGroups.map(g => g.members.length).join(', ')}`);
    console.log(`- Unassigned members: ${unassignedForDate.length}`);
    
    // Check if this schedule has all members assigned
    let thisScheduleCorrect = true;
    
    // In non-strict mode, we should have 0 unassigned members
    if (unassignedForDate.length !== 0) {
      thisScheduleCorrect = false;
      console.log(`  Non-strict Schedule ${scheduleIndex + 1} has ${unassignedForDate.length} unassigned members`);
    }
    
    // Count total assigned members
    const totalAssigned = schedule.lessonGroups.reduce(
      (sum, group) => sum + group.members.length, 0
    );
    
    // All members should be assigned
    if (totalAssigned !== members.length) {
      thisScheduleCorrect = false;
      console.log(`  Non-strict Schedule ${scheduleIndex + 1} only has ${totalAssigned}/${members.length} members assigned`);
    }
    
    // If this schedule is correct, mark it
    if (thisScheduleCorrect) {
      hasCorrectNonStrictSchedule = true;
      console.log(`  ✅ Non-strict Schedule ${scheduleIndex + 1} is correctly assigning all members`);
    }
  });
  
  // The test passes if at least one schedule variation is correct
  nonStrictTestPassed = hasCorrectNonStrictSchedule;
  
  if (!nonStrictTestPassed) {
    console.log(`❌ Non-strict enforcement test failed: No schedule correctly assigned all members`);
  }
  
  // Report results
  if (strictTestPassed) {
    console.log("✅ PASSED: Strict minimum size enforcement correctly left some members unassigned");
  } else {
    console.log("❌ FAILED: Strict minimum size enforcement test failed");
  }
  
  if (nonStrictTestPassed) {
    console.log("✅ PASSED: Non-strict mode correctly assigned all members");
  } else {
    console.log("❌ FAILED: Non-strict mode test failed");
  }
  
  return strictTestPassed && nonStrictTestPassed;
}

// Run all tests
runTests();