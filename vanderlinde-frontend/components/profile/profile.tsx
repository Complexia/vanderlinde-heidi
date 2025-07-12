"use client";

import { useEffect } from 'react';
import useSummaryStore from '@/lib/useSummaryStore';
import useMeetingStore from '@/lib/useMeetingStore';

const Profile = () => {
    const { summary, loading: summaryLoading, fetchSummary, updateSummary } = useSummaryStore();
    const { meetings, loading: meetingsLoading, fetchMeetings } = useMeetingStore();

    useEffect(() => {
        fetchSummary();
        fetchMeetings();
    }, [fetchSummary, fetchMeetings]);



    if (summaryLoading || meetingsLoading) {
        return <div className="flex justify-center items-cente p-8 bg-base-200 min-h-screen w-full"><span className="loading loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen w-full p-8 bg-base-200">
            
                <h1 className="text-3xl font-bold mb-6">Patient Summary</h1>
                {summary ? (
                    <div className="space-y-4">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Current Status:
                                    <span className={`badge ${summary.status === 'Healthy' ? 'badge-success' : summary.status === 'Sick' ? 'badge-error' : 'badge-warning'}`}>
                                        {summary.status}
                                    </span>
                                </h2>
                                <p>{summary.content}</p>
                                <div className="card-actions justify-end">
                                    <p className="text-xs text-gray-500">Last updated: {new Date(summary.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {summary.immediate_next_steps && (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Immediate Next Steps</h2>
                                    <p>{summary.immediate_next_steps}</p>
                                </div>
                            </div>
                        )}

                        {summary.recommendations && (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Recommendations</h2>
                                    <p>{summary.recommendations}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="alert alert-info">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No summary available. Add a meeting to generate one.</span>
                        </div>
                    </div>
                )}
            </div>
        
    );
};

export default Profile;