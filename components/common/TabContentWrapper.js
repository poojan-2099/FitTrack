import React from 'react';

const TabContentWrapper = ({ title, instruction, children }) => (
    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 text-center text-stone-800">{title}</h2>
        <p className="text-sm text-stone-600 text-center mb-4">{instruction}</p>
        {children}
    </div>
);

export default TabContentWrapper; 