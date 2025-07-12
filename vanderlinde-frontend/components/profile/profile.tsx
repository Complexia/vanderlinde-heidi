"use client";

"use client";

import { useEffect, useState } from 'react';
import useSummaryStore from '@/lib/useSummaryStore';
import useMeetingStore from '@/lib/useMeetingStore';
import useDoctorSummaryStore from '@/lib/useDoctorSummaryStore';

const DoctorNotesView = () => {
    const { doctorSummary, loading, fetchDoctorSummary, regenerateDoctorSummary } = useDoctorSummaryStore();

    useEffect(() => {
        fetchDoctorSummary();
    }, [fetchDoctorSummary]);

    if (loading && !doctorSummary) {
        return <div className="flex justify-center items-center p-8"><span className="loading loading-lg"></span></div>;
    }

    return (
        <div className="space-y-4">
            {doctorSummary ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{doctorSummary.summary.content}</p>
                        <div className="card-actions justify-end items-center">
                            <p className="text-xs text-gray-500">Last updated: {new Date(doctorSummary.updated_at).toLocaleString()}</p>
                            <button className="btn btn-primary" onClick={regenerateDoctorSummary} disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Re-evaluate'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-info">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>No doctor summary available. Click 'Re-evaluate' to generate one.</span>
                        <button className="btn btn-primary btn-sm ml-4" onClick={regenerateDoctorSummary} disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Re-evaluate'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Profile = () => {
    const { summary, loading: summaryLoading, fetchSummary } = useSummaryStore();
    const { meetings, loading: meetingsLoading, fetchMeetings } = useMeetingStore();
    const [activeTab, setActiveTab] = useState('forMe');

    useEffect(() => {
        fetchSummary();
        fetchMeetings();
    }, [fetchSummary, fetchMeetings]);



    if (summaryLoading || meetingsLoading) {
        return <div className="flex justify-center items-center p-8 bg-base-200 min-h-screen w-full"><span className="loading loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen w-full p-8 bg-base-200">

            <h1 className="text-3xl font-bold mb-6">Patient Summary</h1>
            <div className="tabs mb-6">
                <a className={`tab tab-bordered ${activeTab === 'forMe' ? 'tab-active' : ''}`} onClick={() => setActiveTab('forMe')}>For me</a>
                <a className={`tab tab-bordered ${activeTab === 'doctorsNotes' ? 'tab-active' : ''}`} onClick={() => setActiveTab('doctorsNotes')}>Doctor's notes</a>
            </div>

            {activeTab === 'forMe' && (summary ? (
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
            ))}

            {activeTab === 'doctorsNotes' && <DoctorNotesView />}
        </div>
    );
};

export default Profile;