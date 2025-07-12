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
          content: 'You are a helpful assistant that summarizes meeting transcripts. Provide a concise summary of the key points, decisions, and action items. Format the output with clear headings for each section (e.g., Key Points, Decisions, Action Items).'
        },
        {
          role: 'user',
          content: `Please summarize the following transcription:\n\n${transcription}`,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Error in summarize API route:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
