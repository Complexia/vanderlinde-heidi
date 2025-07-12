'use client';

import React, { useEffect } from 'react';
import useMeetingStore from '@/lib/useMeetingStore';
import {
  QrCode,
  Link,
  Settings,
  Lightbulb,
  CreditCard,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'qr-code': QrCode,
  link: Link,
  settings: Settings,
  lightbulb: Lightbulb,
  'credit-card': CreditCard,
};

interface ConsultationProps {
  id: string;
}

const Consultation: React.FC<ConsultationProps> = ({ id }) => {
  const { getMeetingById, fetchMeetings, meetings } = useMeetingStore();
  const meeting = getMeetingById(id);

  useEffect(() => {
    if (meetings.length === 0) {
      fetchMeetings();
    }
  }, [fetchMeetings, meetings.length]);

  if (!meeting) {
    return (
      <div className="p-8 bg-base-200 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Consultation not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-base-200 min-h-screen w-full">
      <div className="card bg-base-100 shadow-sm p-6">
        <div className="flex items-start">
          <div className="avatar placeholder mr-4">
            <div className="bg-neutral-focus text-neutral-content rounded-md w-10 h-10">
              <span>{meeting.title.charAt(0)}</span>
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{meeting.title}</h3>
            <p className="text-sm text-base-content/70">{meeting.date}</p>
            <div className="mt-4 space-y-3">
              {meeting.content.map((item, index) => {
                const ItemIcon = iconMap[item.icon] || Sparkles;
                return (
                  <div key={index} className="flex items-start">
                    <ItemIcon className="w-5 h-5 mr-3 mt-1 text-base-content/70" />
                    <p className="text-base-content/90">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
