import React from 'react';

const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto" 
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold mb-4 text-stone-800">{recipe.name}</h3>
                <div>
                    <h4 className="font-semibold text-lg text-teal-700 mb-2">Ingredients:</h4>
                    <ul className="list-disc list-inside text-sm text-stone-600 mb-4 space-y-1">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                        ))}
                    </ul>
                    <h4 className="font-semibold text-lg text-teal-700 mb-2">Instructions:</h4>
                    <p className="text-sm text-stone-600 whitespace-pre-line">{recipe.instructions}</p>
                </div>
                <button 
                    onClick={onClose} 
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 float-right"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default RecipeModal; 