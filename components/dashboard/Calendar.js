import React, { useState } from 'react';
import { DB } from '../../data/db';
import { getCyclicalPlanForDate, getRecipeKeyFromMealName, formatFullDate } from '../../utils/helpers';
import RecipeModal from '../common/RecipeModal';
import TabContentWrapper from '../common/TabContentWrapper';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return today;
    });
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);

    const handleMealClick = (mealName) => {
        const recipeKey = getRecipeKeyFromMealName(mealName);
        if (DB.recipes[recipeKey]) {
            setCurrentRecipe(DB.recipes[recipeKey]);
            setShowRecipeModal(true);
        }
    };

    const MonthCalendar = ({ year, month, onDayClick }) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const emptyCells = Array.from({ length: firstDay }, (_, i) => i);

        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-stone-800">
                        {`${DB.monthNames[month]} ${year}`}
                    </h3>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {DB.dayShortNames.map(day => (
                        <div 
                            key={day} 
                            className="text-center py-2 text-sm font-medium text-stone-600"
                        >
                            {day}
                        </div>
                    ))}
                    {emptyCells.map(i => (
                        <div 
                            key={`empty-${i}`} 
                            className="aspect-square"
                        />
                    ))}
                    {days.map(day => {
                        const currentDate = new Date(year, month, day);
                        currentDate.setHours(0,0,0,0);
                        const plan = getCyclicalPlanForDate(currentDate);
                        const isSelected = currentDate.getTime() === selectedDate.getTime();
                        const isToday = currentDate.getTime() === today.getTime();
                        const hasWorkout = plan.workout.tag;

                        return (
                            <div 
                                key={day} 
                                onClick={() => onDayClick(currentDate)}
                                className={`aspect-square p-1 cursor-pointer transition-all duration-200 ${
                                    isSelected 
                                        ? 'bg-teal-100 rounded-lg' 
                                        : 'hover:bg-stone-50 rounded-lg'
                                } ${isToday ? 'ring-2 ring-teal-500' : ''}`}
                            >
                                <div className="h-full flex flex-col">
                                    <span className={`text-sm font-medium ${
                                        isSelected ? 'text-teal-700' : 'text-stone-700'
                                    }`}>
                                        {day}
                                    </span>
                                    {plan.workout.tag && (
                                        <span className={`text-xs px-1 py-0.5 rounded-full mt-1 ${
                                            plan.workout.color
                                        }`}>
                                            {plan.workout.tag}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const selectedDayPlan = getCyclicalPlanForDate(selectedDate);
    const workoutDetail = DB.workoutDetails.find(wd => wd.id === selectedDayPlan.workout.id);

    return (
        <TabContentWrapper 
            title="Monthly Calendar View" 
            instruction="Click any day for details. Click on meal names in the details panel for recipes."
        >
            <div className="lg:flex lg:gap-8">
                <div className="lg:w-1/2">
                    <MonthCalendar 
                        year={selectedDate.getFullYear()} 
                        month={selectedDate.getMonth()} 
                        onDayClick={setSelectedDate} 
                    />
                </div>
                <div className="lg:w-1/2 mt-6 lg:mt-0">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold mb-4 text-stone-800">
                            Details for <span className="text-teal-600">{formatFullDate(selectedDate)}</span>
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-lg text-stone-700 mb-2">
                                    Workout: {selectedDayPlan.workout.name}
                                </h4>
                                {workoutDetail?.instructions && (
                                    <div 
                                        className="text-sm text-stone-600 mb-3 p-3 bg-stone-50 rounded-lg" 
                                        dangerouslySetInnerHTML={{ __html: workoutDetail.instructions }} 
                                    />
                                )}
                                {workoutDetail?.exercises ? (
                                    <ul className="space-y-2">
                                        {workoutDetail.exercises.map((ex, i) => (
                                            <li 
                                                key={i} 
                                                className="text-sm text-stone-600 flex items-start"
                                            >
                                                <span className="text-teal-600 mr-2">•</span>
                                                {ex}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-stone-600">
                                        Follow prescribed cardio or rest guidelines.
                                    </p>
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-stone-700 mb-2">
                                    Nutrition Plan
                                </h4>
                                <ul className="space-y-2">
                                    {selectedDayPlan.nutrition.map((n, i) => {
                                        const recipeKey = getRecipeKeyFromMealName(n);
                                        const hasRecipe = DB.recipes[recipeKey];
                                        return (
                                            <li 
                                                key={i} 
                                                onClick={() => handleMealClick(n)} 
                                                className={`text-sm flex items-start ${
                                                    hasRecipe 
                                                        ? 'text-teal-600 hover:text-teal-700 cursor-pointer' 
                                                        : 'text-stone-600'
                                                }`}
                                            >
                                                <span className="text-teal-600 mr-2">•</span>
                                                {n}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showRecipeModal && currentRecipe && (
                <RecipeModal 
                    recipe={currentRecipe} 
                    onClose={() => setShowRecipeModal(false)} 
                />
            )}
        </TabContentWrapper>
    );
};

export default Calendar; 