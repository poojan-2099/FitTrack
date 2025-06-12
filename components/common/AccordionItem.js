import React, { useState } from 'react';

const AccordionItem = ({ title, items, instructions, isWorkoutLibrary = false, onItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="bg-stone-50 rounded-lg border border-stone-200 shadow-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center p-3 sm:p-4 font-semibold text-stone-700 cursor-pointer hover:bg-stone-100 rounded-lg text-left"
            >
                <span>{title}</span>
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    &#9660;
                </span>
            </button>
            {isOpen && (
                <div className="p-3 sm:p-4 pt-0 border-t border-stone-200">
                    {instructions && (
                        <div 
                            className="workout-instructions text-sm text-stone-600 mb-4" 
                            dangerouslySetInnerHTML={{ __html: instructions }} 
                        />
                    )}
                    <ul className="mt-2 space-y-2">
                        {items.map((item, index) => (
                            <li 
                                key={index} 
                                className="py-2 px-3 text-sm text-stone-600 hover:bg-stone-100 rounded cursor-pointer transition-colors duration-200"
                                onClick={() => onItemClick && onItemClick(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AccordionItem; 