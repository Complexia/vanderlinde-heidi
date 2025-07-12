"use client";

import { useEffect } from 'react';
import Sidebar from "./ui/sidebar";
import Feed from "./feed/feed";
import useMeetingStore from '@/lib/useMeetingStore';

export default function Interface() {
    const fetchMeetings = useMeetingStore((state) => state.fetchMeetings);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    return (
        <div className="flex">
            <Sidebar />
            <Feed />
        </div>
    );
}