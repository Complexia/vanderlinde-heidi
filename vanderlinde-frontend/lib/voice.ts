
export const summarizeTranscription = async (transcription: string) => {
  if (!transcription) return '';

  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcription }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.summary || 'Could not generate summary.';
  } catch (error) {
    console.error('Error summarizing transcription:', error);
    return 'Error generating summary.';
  }
};
