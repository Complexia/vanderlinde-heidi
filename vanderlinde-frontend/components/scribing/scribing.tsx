'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient, LiveClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { Mic, Square, BrainCircuit } from 'lucide-react';
import useMeetingStore, { Meeting } from '@/lib/useMeetingStore';
import { summarizeTranscription } from '@/lib/voice';

const Scribing = () => {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const deepgramRef = useRef<LiveClient | null>(null);
  const { addMeeting } = useMeetingStore();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || '');
      const connection = deepgram.listen.live({ model: 'nova-2', smart_format: true });
      deepgramRef.current = connection;

      connection.on(LiveTranscriptionEvents.Open, () => {
        setIsListening(true);
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            connection.send(event.data);
          }
        };
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(250); // Start recording and send data every 250ms
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel.alternatives[0].transcript;
        if (transcript) {
          setTranscription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          if (!isTranscribing) setIsTranscribing(true);
        }
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        setIsListening(false);
        setIsTranscribing(false);
        mediaRecorderRef.current?.stop();
        stream.getTracks().forEach((track) => track.stop());
      });

    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }, [isTranscribing]);

  const stopRecordingAndSummarize = useCallback(async () => {
    if (deepgramRef.current) {
      await deepgramRef.current.finish();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setIsSummarizing(true);

    const summary = await summarizeTranscription(transcription);
    
    const newMeeting: Meeting = {
        id: new Date().toISOString(),
        title: 'Scribing Session Summary',
        date: new Date().toLocaleString(),
        content: [
            { icon: 'file-text', text: `Full Transcription: ${transcription}` },
            { icon: 'list-checks', text: `AI Summary: ${summary}` }
        ]
    };

    addMeeting(newMeeting);
    setIsSummarizing(false);
    setTranscription(''); // Reset for next session

  }, [transcription, addMeeting]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center">
      {!isListening && !isSummarizing && !isTranscribing && (
        <button onClick={startRecording} className="btn btn-primary btn-lg">
          <Mic className="w-6 h-6 mr-2" />
          Start Scribing
        </button>
      )}

      {(isListening || isSummarizing || isTranscribing) && (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <div className={`absolute w-full h-full bg-primary rounded-full ${isListening ? 'animate-ping' : ''}`}></div>
            <div className="relative w-40 h-40 bg-base-100 rounded-full flex items-center justify-center">
              {isSummarizing ? (
                <BrainCircuit className="w-20 h-20 text-primary animate-pulse" />
              ) : (
                <Mic className={`w-20 h-20 ${isTranscribing ? 'text-primary' : 'text-base-content'}`} />
              )}
            </div>
          </div>

          <p className="text-2xl font-semibold mb-4">
            {isSummarizing ? 'Generating summary...' : isListening ? 'Now listening in...' : 'Preparing...'}
          </p>

          <div className="w-full max-w-2xl min-h-[100px] bg-base-200 p-4 rounded-lg text-left mb-8">
            <p>{transcription}</p>
          </div>

          {!isSummarizing && (
            <button onClick={stopRecordingAndSummarize} className="btn btn-secondary btn-lg" disabled={!isListening}>
              <Square className="w-6 h-6 mr-2" />
              End Meeting
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Scribing;