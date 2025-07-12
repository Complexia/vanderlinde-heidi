import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from './supabaseClient';
import useSummaryStore from './useSummaryStore';

export interface MeetingContent {
  icon: string;
  text: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  content: MeetingContent[];
}

interface MeetingState {
  meetings: Meeting[];
  loading: boolean;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => Promise<void>;
  fetchMeetings: () => Promise<void>;
  getMeetingById: (id: string) => Meeting | undefined;
}

const useMeetingStore = create<MeetingState>()(
  devtools(
    (set, get) => ({
      meetings: [],
      loading: true,
      addMeeting: async (meeting) => {
        const { data: newMeetingData, error } = await supabase.from('notes').insert([{ ...meeting }]).select().single();

        if (error || !newMeetingData) {
          console.error('Error adding meeting:', error);
          return;
        }

        set((state) => ({ meetings: [newMeetingData, ...state.meetings] }));

        // After adding the meeting, trigger the summary update
        const { summary: existingSummary, updateSummary } = useSummaryStore.getState();

        try {
          const res = await fetch('/api/profile/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meetings: [newMeetingData], existingSummary }),
          });

          if (!res.ok) {
            throw new Error('Failed to generate summary');
          }

          const newSummaryContent = await res.json();
          if (newSummaryContent.content && newSummaryContent.status) {
            await updateSummary(newSummaryContent);
          }
        } catch (e) {
          console.error('Failed to update summary after adding meeting:', e);
        }
      },
      getMeetingById: (id) => get().meetings.find((m) => m.id === id),
      fetchMeetings: async () => {
        set({ loading: true });
        const { data: meetings, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching meetings:', error);
          set({ loading: false });
          return;
        }

        set({ meetings: meetings || [], loading: false });
      },
    }),
    { name: 'meeting-store' }
  )
);

export default useMeetingStore;
