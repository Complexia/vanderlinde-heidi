import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { meetings, patientSummary } = await req.json();

    if (!meetings && !patientSummary) {
      return NextResponse.json({ error: 'No data provided for summary generation.' }, { status: 400 });
    }

    // Construct a detailed prompt for the AI
    const prompt = `
      Based on the following patient summary and meeting notes, please generate a long, considered summary of at least 3 paragraphs containing a detailed patient summary. 
      This summary should be suitable for a doctor to review, providing a comprehensive overview of the patient's situation, progress, and any concerns. Don't include patient ID, use patient name. Patient name is Roma Lobanov.
      Consider recurring health issues, for example if there are multiple consultations for the same thing like a cold, specifically
      mention that the patient has immunity problems and is prone to getting sick. Look for patterns. Look through all of the meeting notes to make this assessment.

      Patient Summary:
      ${patientSummary ? JSON.stringify(patientSummary, null, 2) : 'No summary available.'}

      Meeting Notes:
      ${meetings ? meetings.map((note: any) => note.content.map((c: any) => c.text).join('\n')).join('\n\n---\n\n') : 'No meeting notes available.'}

      Please provide a detailed, well-structured summary below.
    `;

    // console.log("prompt",prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a highly skilled medical assistant tasked with summarizing patient data for doctors.' 
        },
        { 
          role: 'user', 
          content: prompt 
        },
      ],
      max_tokens: 800,
    });

    const content = response.choices[0].message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Failed to generate summary from AI.' }, { status: 500 });
    }

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Error generating doctor summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
