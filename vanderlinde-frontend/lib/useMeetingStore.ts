import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
  addMeeting: (meeting: Meeting) => void;
  fetchMeetings: () => Promise<void>;
  getMeetingById: (id: string) => Meeting | undefined;
}

const useMeetingStore = create<MeetingState>()(
  devtools(
    (set, get) => ({
      meetings: [],
      loading: true,
      addMeeting: (meeting) => set((state) => ({ meetings: [meeting, ...state.meetings] })), 
      getMeetingById: (id) => get().meetings.find((m) => m.id === id),
      fetchMeetings: async () => {
        set({ loading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({
          meetings: [
            {
              id: '1',
              title: 'SuperChem feedback + OP growth strat',
              date: 'Wed, Jul 9 · 5:30 PM',
              content: [
                {
                  icon: 'qr-code',
                  text: 'QR Code Utilization: Only 4 out of 15 locations can effectively use QR codes due to conflicts with nearby medical centers.',
                },
                {
                  icon: 'link',
                  text: 'Integration Needs: Integration with five dispensing systems is crucial for pharmacy-initiated consultations.',
                },
                {
                  icon: 'settings',
                  text: 'Automation Required: Current manual entry processes are impractical; pharmacies need automated solutions for efficiency.',
                },
                {
                  icon: 'lightbulb',
                  text: 'Education for Staff: Awareness on bulk billing services is lacking; education is essential for proper implementation.',
                },
                {
                  icon: 'credit-card',
                  text: 'One-Time Payment Model: A one-time payment model for integration costs is necessary to encourage adoption without ongoing fees.',
                },
              ],
            },
            {
              id: '2',
              title: 'New item, some random stuff',
              date: 'Wed, Jul 9 · 5:30 PM',
              content: [
                {
                  icon: 'qr-code',
                  text: 'QR Code Utilization: Only 4 out of 15 locations can effectively use QR codes due to conflicts with nearby medical centers.',
                },
                {
                  icon: 'link',
                  text: 'Integration Needs: Integration with five dispensing systems is crucial for pharmacy-initiated consultations.',
                },
                {
                  icon: 'settings',
                  text: 'Automation Required: Current manual entry processes are impractical; pharmacies need automated solutions for efficiency.',
                },
                {
                  icon: 'lightbulb',
                  text: 'Education for Staff: Awareness on bulk billing services is lacking; education is essential for proper implementation.',
                },
                {
                  icon: 'credit-card',
                  text: 'One-Time Payment Model: A one-time payment model for integration costs is necessary to encourage adoption without ongoing fees.',
                },
              ],
            },
          ],
          loading: false,
        });
      },
    }),
    { name: 'meeting-store' }
  )
);

export default useMeetingStore;
