import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text data is required' },
        { status: 400 }
      );
    }
    
    // Call the OpenAI API to analyze the text
    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview", // Using a more reliable model name
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts structured schedule information from text. Extract all lesson dates and member names with their unavailable dates."
        },
        {
          role: "user",
          content: `Extract the schedule information from this text. Find all lesson dates and all person names with their unavailable dates. Convert all dates to YYYY-MM-DD format.

Return the data in the following JSON format:
{
  "lessonDates": ["YYYY-MM-DD", "YYYY-MM-DD", ...],
  "members": [
    {
      "id": 1,
      "name": "Person Name",
      "unavailableDates": ["YYYY-MM-DD", "YYYY-MM-DD", ...]
    },
    ...
  ]
}

If the year is not specified in a date, assume the current year. If a person is out for a specific month or range of dates, list all the individual dates. 

Even if the text doesn't seem to contain clear schedule information, make your best attempt to extract any relevant dates and names. If no lesson dates are specified, leave the lessonDates array empty.

Here's the text to extract from:

${text}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.2, // Lower temperature for more deterministic output
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    
    try {
      const extractedData = JSON.parse(content);
      
      // Validate the extracted data structure
      if (!extractedData.members || !Array.isArray(extractedData.members)) {
        throw new Error('Invalid data structure returned from AI');
      }
      
      // Assign IDs if not present and ensure unavailableDates is always an array
      extractedData.members = extractedData.members.map((member, index) => ({
        ...member,
        id: member.id || index + 1,
        unavailableDates: member.unavailableDates || []
      }));
      
      return NextResponse.json(extractedData);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      
      // Fallback response with simplified data
      return NextResponse.json({
        lessonDates: [],
        members: [
          { id: 1, name: "AI could not extract data properly", unavailableDates: [] }
        ],
        error: "Failed to parse AI response"
      });
    }
    
  } catch (error) {
    console.error('Error processing text:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process text' },
      { status: 500 }
    );
  }
}