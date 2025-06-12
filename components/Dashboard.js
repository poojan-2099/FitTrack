// This is the complete and final code for `components/Dashboard.js`.
// This single file replaces the previous placeholder version and contains all necessary components.

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import TodayOverview from './dashboard/TodayOverview';
import Nutrition from './dashboard/Nutrition';
import Workouts from './dashboard/Workouts';
import Calculators from './dashboard/Calculators';
import Mindset from './dashboard/Mindset';
import Goals from './dashboard/Goals';
import Calendar from './dashboard/Calendar';

const Dashboard = ({ userData }) => {
    const router = useRouter();
    const { signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('today');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'today':
                return <TodayOverview userData={userData} />;
            case 'nutrition':
                return <Nutrition />;
            case 'workouts':
                return <Workouts />;
            case 'calculators':
                return <Calculators />;
            case 'mindset':
                return <Mindset />;
            case 'goals':
                return <Goals />;
            case 'calendar':
                return <Calendar />;
            default:
                return <TodayOverview userData={userData} />;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-teal-600">FitTrack</h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <button
                                    onClick={() => setActiveTab('today')}
                                    className={`${
                                        activeTab === 'today'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setActiveTab('nutrition')}
                                    className={`${
                                        activeTab === 'nutrition'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Nutrition
                                </button>
                                <button
                                    onClick={() => setActiveTab('workouts')}
                                    className={`${
                                        activeTab === 'workouts'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Workouts
                                </button>
                                <button
                                    onClick={() => setActiveTab('calculators')}
                                    className={`${
                                        activeTab === 'calculators'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Calculators
                                </button>
                                <button
                                    onClick={() => setActiveTab('mindset')}
                                    className={`${
                                        activeTab === 'mindset'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Mindset
                                </button>
                                <button
                                    onClick={() => setActiveTab('goals')}
                                    className={`${
                                        activeTab === 'goals'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Goals
                                </button>
                                <button
                                    onClick={() => setActiveTab('calendar')}
                                    className={`${
                                        activeTab === 'calendar'
                                            ? 'border-teal-500 text-stone-900'
                                            : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Calendar
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 text-stone-700 hover:text-stone-900 focus:outline-none"
                                >
                                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                                        <span className="text-teal-600 font-medium">
                                            {userData?.name?.[0]?.toUpperCase() || userData?.email?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="hidden md:block text-sm font-medium">
                                        {userData?.name || userData?.email?.split('@')[0]}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100"
                                                role="menuitem"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
