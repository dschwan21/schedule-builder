# Schedule Builder

A Next.js application for creating and managing group schedules with AI-powered image data extraction.

## Features

- Create schedules for groups with customizable constraints
- Extract member names and availability from images using AI
- Process schedule information from pasted text (emails, notes)
- Review and edit AI-extracted data
- Generate optimal schedules based on member availability
- Preview and save generated schedules

## AI Integration

This application uses OpenAI's APIs to extract information from both images and text:

### Image Processing
Uses OpenAI's Vision API to analyze schedule images:
1. Identifies member names from images
2. Detects unavailable dates for each member
3. Formats the data in a structured way for schedule generation

### Text Processing
Uses OpenAI's GPT-4 to parse schedule information from text:
1. Extracts lesson dates from emails or notes
2. Identifies members and their unavailable dates
3. Converts dates to a standardized format for easy processing

### Setting Up the AI Integration

1. Sign up for an [OpenAI API key](https://platform.openai.com/)
2. Create a `.env.local` file in the project root
3. Add your OpenAI API key to the file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## AI Data Input Guidelines

### Image Upload Guidelines

For best results when using the AI image extraction:

- Use clear, well-lit images
- Ensure names and dates are clearly visible
- Tables, spreadsheets, and calendars work best
- For handwritten schedules, ensure the writing is legible

### Text Input Guidelines

For best results when pasting text:

- Include clear information about lesson dates (e.g., "Tuesdays: Jan 7, 14, 21")
- List member names followed by their unavailable dates
- Structured text from emails, spreadsheets, or notes works best
- Include the year for dates when possible

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new).

Make sure to add your environment variables to your Vercel project settings.
