import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client securely on the server
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: 'Transcription is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          //content: 'You are a helpful scribe that summarizes an inperson conversation (normally between 2 people) that is generally a doctors appointment transcript. Provide a concise summary of the key points, decisions, and action items. Format the output with clear headings for each section (e.g., Key Points, Decisions, Action Items). Even if the conversation is unclear and at points inaudible, feel in the gaps as much as possible such that the user gets a complete and comprehensive summary every time. Sacrifice accuracy for completeness.'
          content: `You are a medical assistant AI. Summarize the following doctor-patient consultation in clear dot points. \
                    Extract key information like symptoms, diagnosis, medications, and suggested follow-ups. If the conversation is \
                    inaudible or unclear, feel in the gaps as much as possible such that the user gets a complete and \
                    comprehensive summary every time. Sacrifice accuracy for completeness. Dont repeat the full transcription in the response \
                    just the summary. Here is an example response structure, return it in exactly this format: \
                    {"title": "Random GP appointment", "contentSummary":
                    [
  {
    "icon": "qr-code",
    "text": "QR Code Utilization: Only 4 out of 15 locations can effectively use QR codes due to conflicts with nearby medical centers."
  },
  {
    "icon": "link",
    "text": "Integration Needs: Integration with five dispensing systems is crucial for pharmacy-initiated consultations."
  },
  {
    "icon": "settings",
    "text": "Automation Required: Current manual entry processes are impractical; pharmacies need automated solutions for efficiency."
  },
  {
    "icon": "lightbulb",
    "text": "Education for Staff: Awareness on bulk billing services is lacking; education is essential for proper implementation."
  },
  {
    "icon": "One-Time Payment Model: A one-time payment model for integration costs is necessary to encourage adoption without ongoing fees."
  }
        ]}
  `
        },
        {
          role: 'user',
          content: `Please summarize the following transcription:\n\n${transcription}`,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    console.log("-------SUMMARY-------");
    console.log(response);
    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Error in summarize API route:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
