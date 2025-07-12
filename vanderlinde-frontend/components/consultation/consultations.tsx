'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import useMeetingStore from '@/lib/useMeetingStore';
import {
  QrCode,
  Link as LinkIcon,
  Settings,
  Lightbulb,
  CreditCard,
  MessageSquare,
  Sparkles,
  Plus,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'qr-code': QrCode,
  link: LinkIcon,
  settings: Settings,
  lightbulb: Lightbulb,
  'credit-card': CreditCard,
};

const Consultations = () => {
  const { meetings, loading, fetchMeetings } = useMeetingStore();

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return (
    <div className="p-8 bg-base-200 min-h-screen w-full">
      <div className="flex justify-between items-center">
        <div className="tabs">
          <a className="tab tab-bordered tab-active">My Feed</a>
          <a className="tab tab-bordered">Tasks</a>
          <a className="tab tab-bordered">AI Apps <div className="badge badge-sm badge-primary ml-2">NEW</div></a>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Consultation
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-10">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4 text-lg">Fetching...</span>
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center p-10">
            <p className="text-lg">So empty here...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-primary" />
                    All time consultations · {meetings.length} Consultation{meetings.length > 1 ? 's' : ''}
                </h2>
                <button className="btn btn-ghost btn-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Share Feedback
                </button>
            </div>
            {meetings.map((meeting) => {
              const Icon = iconMap[meeting.id] || Sparkles;
              return (
                <Link key={meeting.id} href={`/consultations/${meeting.id}`} className="card bg-base-100 shadow-sm p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
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
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;
