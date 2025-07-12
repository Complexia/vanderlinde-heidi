import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MeetingContent {
  icon: string;
  text: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  content: MeetingContent[];
}

interface MeetingState {
  meetings: Meeting[];
  loading: boolean;
  fetchMeetings: () => Promise<void>;
}

const useMeetingStore = create<MeetingState>()(
  devtools(
    (set) => ({
      meetings: [],
      loading: true,
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
          ],
          loading: false,
        });
      },
    }),
    { name: 'meeting-store' }
  )
);

export default useMeetingStore;
