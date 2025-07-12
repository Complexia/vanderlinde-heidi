import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { meetings, existingSummary } = await req.json();

    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
      return NextResponse.json({ error: 'No meetings provided' }, { status: 400 });
    }

    const contentToSummarize = meetings.map((m: any) => m.content.map((c: any) => c.text).join('\n')).join('\n\n---\n\n');

    const systemPrompt = `You are a medical assistant responsible for summarizing patient notes.
Analyze the provided meeting notes and generate a concise summary of the patient's health status.
Include in your response structure immediate next steps and recommendations as per the response structure.
If an existing summary is provided, you must update it with the new information from the latest meeting note. Otherwise, create a new summary from all the notes provided.
Make it in second person, like you would be telling me about it, ie. You are recovering from...etc

The output must be a JSON object with the following structure: { "content": "string", "status": "string", "immediate_next_steps": "string", "recommendations": "string" }.
- 'content': A summary of the patient's current condition, including any illnesses, allergies, ailments, and general health status.
- 'status': A single word describing the patient's overall health (e.g., Healthy, Sick, Recovering, Stable, Critical).`;

    const userPrompt = existingSummary
      ? `Here is the latest meeting note to update the summary with:\n\n${contentToSummarize}\n\nAnd here is the existing summary to update:\n\n${JSON.stringify(existingSummary)}`
      : `Here are all the meeting notes to create a summary from:\n\n${contentToSummarize}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const summaryJson = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json(summaryJson);

  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
