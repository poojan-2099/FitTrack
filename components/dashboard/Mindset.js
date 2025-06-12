import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import TabContentWrapper from '../common/TabContentWrapper';
import { getDailyQuote } from '../../utils/api';

const Mindset = () => {
    const { user, userData } = useAuth();
    const [journalEntry, setJournalEntry] = useState('');
    const [dailyQuote, setDailyQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuote = async () => {
            const quote = await getDailyQuote();
            setDailyQuote(quote);
            setIsLoading(false);
        };
        loadQuote();
    }, []);

    const handleJournalSubmit = async (e) => {
        e.preventDefault();
        if (!user || !journalEntry.trim()) return;

        try {
            const userRef = doc(db, "users", user.uid);
            const today = new Date().toISOString().split('T')[0];
            
            await updateDoc(userRef, {
                [`journalEntries.${today}`]: {
                    content: journalEntry,
                    timestamp: new Date().toISOString()
                }
            });
            
            setJournalEntry('');
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
    };

    return (
        <TabContentWrapper 
            title="Mindset & Progress" 
            instruction="Track your mental fitness journey"
        >
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-stone-800 mb-4">Daily Motivation</h3>
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-stone-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                        </div>
                    ) : dailyQuote ? (
                        <div className="space-y-4">
                            <blockquote className="text-lg italic text-stone-700 border-l-4 border-teal-500 pl-4">
                                "{dailyQuote.quote}"
                            </blockquote>
                            <p className="text-sm text-stone-600">- {dailyQuote.author}</p>
                            <div className="flex flex-wrap gap-2">
                                {dailyQuote.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-stone-800 mb-4">Fitness Journal</h3>
                    <form onSubmit={handleJournalSubmit} className="space-y-4">
                        <div>
                            <label 
                                htmlFor="journalEntry" 
                                className="block text-sm font-medium text-stone-700 mb-1"
                            >
                                Today's Entry
                            </label>
                            <textarea
                                id="journalEntry"
                                value={journalEntry}
                                onChange={(e) => setJournalEntry(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                rows="4"
                                placeholder="How are you feeling today? What are your fitness goals and achievements?"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            Save Entry
                        </button>
                    </form>

                    {userData?.journalEntries && Object.keys(userData.journalEntries).length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-medium text-stone-800 mb-3">Recent Entries</h4>
                            <div className="space-y-4">
                                {Object.entries(userData.journalEntries)
                                    .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp))
                                    .slice(0, 3)
                                    .map(([date, entry]) => (
                                        <div key={date} className="bg-stone-50 p-4 rounded-lg">
                                            <p className="text-sm text-stone-600 mb-2">
                                                {new Date(date).toLocaleDateString()}
                                            </p>
                                            <p className="text-stone-700">{entry.content}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TabContentWrapper>
    );
};

export default Mindset; 