import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from './supabaseClient';
import useMeetingStore from './useMeetingStore';
import useSummaryStore from './useSummaryStore';

export interface DoctorSummary {
  updated_at: string;
  summary: { 
    content: string;
  };
  id?: string;
}

interface DoctorSummaryState {
  doctorSummary: DoctorSummary | null;
  loading: boolean;
  fetchDoctorSummary: () => Promise<void>;
  regenerateDoctorSummary: () => Promise<void>;
}

const useDoctorSummaryStore = create<DoctorSummaryState>()(
  devtools(
    (set, get) => ({
      doctorSummary: null,
      loading: false,

      fetchDoctorSummary: async () => {
        set({ loading: true });
        const { data, error } = await supabase.from('doctor_summary').select('*').single();

        if (error && error.code === 'PGRST116') {
          console.log('No doctor summary found. Generating one.');
          await get().regenerateDoctorSummary();
        } else if (error) {
          console.error('Error fetching doctor summary:', error);
          set({ doctorSummary: null, loading: false });
        } else {
          set({ doctorSummary: data, loading: false });
        }
      },

      regenerateDoctorSummary: async () => {
        set({ loading: true });

        // Get meetings and patient summary
        const { meetings, fetchMeetings } = useMeetingStore.getState();
        if (meetings.length === 0) {
          await fetchMeetings();
        }
        const allMeetings = useMeetingStore.getState().meetings;

        const { summary: patientSummary, fetchSummary } = useSummaryStore.getState();
        if (!patientSummary) {
            await fetchSummary();
        }
        const currentPatientSummary = useSummaryStore.getState().summary;

        if (allMeetings.length === 0 && !currentPatientSummary) {
            console.log("No meetings or patient summary available to generate doctor's summary.");
            set({ loading: false });
            return;
        }

        try {
          const res = await fetch('/api/profile/doctors-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                meetings: allMeetings,
                patientSummary: currentPatientSummary
            }),
          });

          if (!res.ok) throw new Error('Failed to generate doctor summary');

          const newDoctorSummary = await res.json();

          // Check if a summary already exists to decide whether to insert or update
          const { data: existing } = await supabase.from('doctor_summary').select('id').single();

          let data, error;
          const summaryPayload = {
            summary: newDoctorSummary,
            updated_at: new Date().toISOString(),
          }

          if (existing && existing.id) {
            ({ data, error } = await supabase
              .from('doctor_summary')
              .update(summaryPayload)
              .eq('id', existing.id)
              .select()
              .single());
          } else {
            ({ data, error } = await supabase.from('doctor_summary').insert(summaryPayload).select().single());
          }

          if (error) throw error;

          set({ doctorSummary: data, loading: false });

        } catch (e) {
          console.error('Failed to create or update doctor summary:', e);
          set({ loading: false });
        }
      },
    }),
    { name: 'doctor-summary-store' }
  )
);

export default useDoctorSummaryStore;
