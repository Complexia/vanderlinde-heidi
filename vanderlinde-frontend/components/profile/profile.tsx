"use client";

import { useEffect, useState } from 'react';
import useSummaryStore from '@/lib/useSummaryStore';
import useMeetingStore from '@/lib/useMeetingStore';
import useDoctorSummaryStore from '@/lib/useDoctorSummaryStore';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorNotesView = () => {
    const { doctorSummary, loading, fetchDoctorSummary, regenerateDoctorSummary } = useDoctorSummaryStore();
    const [sharingCode, setSharingCode] = useState<string | null>(null);

    useEffect(() => {
        fetchDoctorSummary();
    }, [fetchDoctorSummary]);

    const handleShare = async () => {
        if (!doctorSummary?.id) {
            console.error("Cannot share: doctor summary or ID is missing.");
            return;
        }

        try {
            const response = await fetch('/api/profile/share-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ note_id: doctorSummary.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate sharing code');
            }

            const { code } = await response.json();
            setSharingCode(code);
        } catch (error) {
            console.error('Error sharing note:', error);
            // Optionally, show an error to the user
        }
    };

    if (loading && !doctorSummary) {
        return <div className="flex justify-center items-center p-8"><span className="loading loading-lg"></span></div>;
    }

    const renderControls = () => (
        <div className="flex items-center gap-4 mt-4">
            <AnimatePresence mode="wait">
                {!sharingCode ? (
                    <motion.div
                        key="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button onClick={handleShare} className="btn btn-outline" disabled={!doctorSummary?.id}>
                            Share with your Doctor
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="code"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-mono bg-base-300 p-3 rounded-md tracking-widest"
                    >
                        {sharingCode}
                    </motion.div>
                )}
            </AnimatePresence>
            <button className="btn btn-primary" onClick={regenerateDoctorSummary} disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Re-evaluate'}
            </button>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Doctor's Notes</h2>
            {doctorSummary ? (
                <div className="bg-base-200 p-4 rounded-lg">
                                        <p className="whitespace-pre-wrap">{doctorSummary.summary.content}</p>
                    {renderControls()}
                </div>
            ) : (
                <div role="alert" className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <h3 className="font-bold">No Summary Available</h3>
                        <div className="text-xs">Click 'Re-evaluate' to generate one based on your history.</div>
                        {renderControls()}
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