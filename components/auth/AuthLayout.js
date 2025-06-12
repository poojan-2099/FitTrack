import React from 'react';
import Link from 'next/link';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xl font-bold text-stone-900">FitTrack</span>
                    </Link>
                </div>
            </div>
            <main>{children}</main>
            <footer className="mt-8 py-6 text-center text-sm text-stone-600">
                <p>© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AuthLayout; 