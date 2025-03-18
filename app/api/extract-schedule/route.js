import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }
    
    // Call the OpenAI API to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Extract the schedule information from this image. Find all person names and their unavailable dates. Return the data in the following JSON format: {\"members\": [{\"id\": 1, \"name\": \"Person Name\", \"unavailableDates\": [\"YYYY-MM-DD\"]}, ...]} If you can't determine specific dates but see symbols or markings indicating unavailability, make your best guess at the dates based on the context in the image." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    
    // Try to extract JSON from the content
    try {
      // Find JSON string in the response (it might be surrounded by backticks or text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const extractedData = JSON.parse(jsonMatch[0]);
        
        // Validate the extracted data structure
        if (!extractedData.members || !Array.isArray(extractedData.members)) {
          throw new Error('Invalid data structure returned from AI');
        }
        
        // Assign IDs if not present
        extractedData.members = extractedData.members.map((member, index) => ({
          ...member,
          id: member.id || index + 1,
          // Ensure unavailableDates is always an array
          unavailableDates: member.unavailableDates || []
        }));
        
        return NextResponse.json(extractedData);
      } else {
        throw new Error('Could not find valid JSON in the response');
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      
      // Fallback response with simplified data
      return NextResponse.json({
        members: [
          { id: 1, name: "AI could not extract names properly", unavailableDates: [] }
        ],
        error: "Failed to parse AI response"
      });
    }
    
  } catch (error) {
    console.error('Error processing image:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}