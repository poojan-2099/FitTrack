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
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowMobileMenu(false);
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

    const navigationItems = [
        { id: 'today', label: 'Today' },
        { id: 'nutrition', label: 'Nutrition' },
        { id: 'workouts', label: 'Workouts' },
        { id: 'calculators', label: 'Calculators' },
        { id: 'mindset', label: 'Mindset' },
        { id: 'goals', label: 'Goals' },
        { id: 'calendar', label: 'Calendar' }
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <button
                                    onClick={() => handleTabChange('today')}
                                    className="text-xl font-bold text-teal-600 hover:text-teal-700 transition-colors duration-200"
                                >
                                    FitTrack
                                </button>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigationItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`${
                                            activeTab === item.id
                                                ? 'border-teal-500 text-stone-900'
                                                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
                                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-stone-400 hover:text-stone-500 hover:bg-stone-100 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {showMobileMenu ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                            <div className="relative ml-3">
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

            {/* Mobile menu */}
            <div
                className={`${
                    showMobileMenu ? 'translate-x-0' : '-translate-x-full'
                } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out sm:hidden`}
            >
                <div className="pt-5 pb-4 px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-stone-900">Menu</h2>
                        <button
                            onClick={() => setShowMobileMenu(false)}
                            className="text-stone-400 hover:text-stone-500"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <nav className="space-y-1">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`${
                                    activeTab === item.id
                                        ? 'bg-teal-50 text-teal-600'
                                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                } w-full flex items-center px-3 py-2 text-base font-medium rounded-md`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
