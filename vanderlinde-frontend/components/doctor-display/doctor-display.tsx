"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface DoctorDisplayProps {
  sharingCode: string;
}

export default function DoctorDisplay({ sharingCode }: DoctorDisplayProps) {
    // The supabase client is imported directly
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctorSummary() {
      if (!sharingCode) {
        setError("No sharing code provided.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the shared note entry
        const { data: sharedNote, error: sharedNoteError } = await supabase
          .from('shared_doctor_notes')
          .select('note_id, expires_at')
          .eq('sharing_code', sharingCode)
          .single();

        if (sharedNoteError || !sharedNote) {
          console.error('Error fetching shared note:', sharedNoteError);
          setError("This link is invalid or has expired.");
          setIsLoading(false);
          return;
        }

        if (new Date(sharedNote.expires_at) < new Date()) {
            setError("This link has expired.");
            setIsLoading(false);
            return;
        }

        // Fetch the actual doctor's note using the note_id
        const { data: note, error: noteError } = await supabase
          .from('doctor_summary')
          .select('summary')
          .eq('id', sharedNote.note_id)
          .single();

        if (noteError || !note) {
          console.error("Error fetching doctor's note:", noteError);
          setError("Could not retrieve the doctor's summary.");
          setIsLoading(false);
          return;
        }

        console.log(note.summary);
        setSummary(note.summary.content);
      } catch (e) {
        console.error('An unexpected error occurred:', e);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoctorSummary();
  }, [sharingCode, supabase]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-base-200  mx-auto p-8">
      <div className="shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Doctor's Summary</h1>
        <p className="whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
}
