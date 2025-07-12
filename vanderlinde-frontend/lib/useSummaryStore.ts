import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from './supabaseClient';
import useMeetingStore from './useMeetingStore'; // Import meeting store

export interface Summary {
  updated_at: string;
  content: string;
  status: string;
  id?: string;
  immediate_next_steps?: string;
  recommendations?: string;
}

interface SummaryState {
  summary: Summary | null;
  loading: boolean;
  fetchSummary: () => Promise<void>;
  updateSummary: (summary: Partial<Summary>) => Promise<void>;
}

const useSummaryStore = create<SummaryState>()(
  devtools(
    (set, get) => ({
      summary: null,
      loading: true,
      fetchSummary: async () => {
        set({ loading: true });
        const { data, error } = await supabase.from('summary').select('*').single();

        if (error && error.code === 'PGRST116') {
          // No summary found, create one from all meetings
          console.log('No summary found. Attempting to create one from all meetings.');
          const { meetings, fetchMeetings } = useMeetingStore.getState();

          // Ensure meetings are loaded before proceeding
          if (meetings.length === 0) {
            await fetchMeetings();
          }
          const allMeetings = useMeetingStore.getState().meetings;

          if (allMeetings.length > 0) {
            try {
              const res = await fetch('/api/profile/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meetings: allMeetings, existingSummary: null }),
              });

              if (!res.ok) throw new Error('Failed to generate initial summary');

              const newSummaryContent = await res.json();
              if (newSummaryContent.content && newSummaryContent.status) {
                await get().updateSummary(newSummaryContent); // This will create and set the new summary
              }
            } catch (e) {
              console.error('Failed to create initial summary:', e);
              set({ summary: null }); // Ensure summary is null on failure
            } finally {
              set({ loading: false });
            }
          } else {
            // No meetings exist, so no summary can be created.
            set({ summary: null, loading: false });
          }
        } else if (error) {
          // Handle other errors
          console.error('Error fetching summary:', error);
          set({ summary: null, loading: false });
        } else {
          // Summary found, update state
          set({ summary: data, loading: false });
        }
      },
      updateSummary: async (newSummaryContent) => {
        const currentSummary = get().summary;

        // Ensure content is not empty before updating
        if (!newSummaryContent.content) {
          console.warn('Attempted to update summary with empty content.');
          return;
        }

        const summaryToUpdate = {
          ...newSummaryContent,
          updated_at: new Date().toISOString(),
        };

        let data, error;

        if (currentSummary && currentSummary.id) {
          // Update existing summary
          ({ data, error } = await supabase
            .from('summary')
            .update(summaryToUpdate)
            .eq('id', currentSummary.id)
            .select()
            .single());
        } else {
          // Create new summary
          ({ data, error } = await supabase.from('summary').insert(summaryToUpdate).select().single());
        }

        if (error) {
          console.error('Error updating summary:', error);
          return;
        }

        if (data) {
          set({ summary: data });
        }
      },
    }),
    { name: 'summary-store' }
  )
);

export default useSummaryStore;
