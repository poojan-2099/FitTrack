import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DB } from '../../data/db';
import { getCyclicalPlanForDate, getRecipeKeyFromMealName, getTaskKeyFromString } from '../../utils/helpers';
import RecipeModal from '../common/RecipeModal';
import TabContentWrapper from '../common/TabContentWrapper';
import { useAuth } from '../../contexts/AuthContext';

const TodayOverview = ({ userData }) => {
    const { user } = useAuth();
    const [todayPlan, setTodayPlan] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const dateKey = new Date().toISOString().split('T')[0];
    const dailyTasksStatus = userData?.taskLogs?.[dateKey] || {};

    useEffect(() => {
        // Initialize today's plan
        const today = new Date();
        const plan = getCyclicalPlanForDate(today);
        setTodayPlan(plan);

        // Set reminders based on current time
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const filteredReminders = DB.dailyScheduleReminders.filter(reminder => {
            return reminder.hour > currentHour || (reminder.hour === currentHour && reminder.minute > currentMinute);
        });
        setReminders(filteredReminders);
    }, []);

    const toggleTaskCompletion = async (taskName) => {
        if (!user || !userData || isUpdating) return;
        
        try {
            setIsUpdating(true);
            const newStatus = !dailyTasksStatus[taskName];
            const updatedLogs = {
                ...userData.taskLogs,
                [dateKey]: {
                    ...dailyTasksStatus,
                    [taskName]: newStatus
                }
            };
            
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { taskLogs: updatedLogs });
            
            // Update local state
            const updatedTasksStatus = {
                ...dailyTasksStatus,
                [taskName]: newStatus
            };
            userData.taskLogs = {
                ...userData.taskLogs,
                [dateKey]: updatedTasksStatus
            };
        } catch (error) {
            console.error('Error updating task status:', error);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleMealClick = (mealName) => {
        if (!mealName) return;
        const recipeKey = getRecipeKeyFromMealName(mealName);
        if (recipeKey && DB.recipes[recipeKey]) {
            setSelectedRecipe(DB.recipes[recipeKey]);
            setShowRecipeModal(true);
        }
    };
    
    const workoutInstructions = DB.workoutDetails.find(wd => wd.id === todayPlan?.workout?.id)?.instructions;

    return (
        <TabContentWrapper 
            title="Today's Overview" 
            instruction="Track your daily tasks and stay motivated with your fitness journey."
        >
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="text-lg font-semibold mb-4 text-stone-800">
                        Welcome, {userData?.displayName || userData?.email?.split('@')[0] || 'User'}!
                    </h3>
                    <p className="text-stone-600">Let's make today count towards your fitness goals.</p>
                </div>
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="text-lg font-semibold mb-4 text-stone-800">Quick Stats</h3>
                    <div className="space-y-2">
                        <p className="text-stone-600">Height: {userData?.height || 'Not set'} cm</p>
                        <p className="text-stone-600">Weight: {userData?.weight || 'Not set'} kg</p>
                        <p className="text-stone-600">Goal: {userData?.goal ? userData.goal.replace('_', ' ').toUpperCase() : 'Not set'}</p>
                    </div>
                </div>
            </div>
            <div className="reminder-box mt-6 mb-4">
                <p><strong className="block mb-1">Today's Focus:</strong> {reminders.length > 0 ? reminders[0].message : "Great job today! Time to wind down."}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="font-semibold text-lg mb-3 text-stone-800">Today's Workout Task</h3>
                    <div className="task-item">
                        <p className={`text-sm ${dailyTasksStatus['workout'] ? 'line-through text-stone-400' : ''}`}>
                            {todayPlan?.workout?.name}
                        </p>
                        <button 
                            onClick={() => toggleTaskCompletion('workout')} 
                            disabled={isUpdating}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                dailyTasksStatus['workout'] 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUpdating ? 'Updating...' : dailyTasksStatus['workout'] ? 'Done ✔' : 'Mark Done'}
                        </button>
                    </div>
                    {workoutInstructions && (
                        <div className="workout-instructions text-xs mt-2" dangerouslySetInnerHTML={{ __html: workoutInstructions }} />
                    )}
                </div>
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="font-semibold text-lg mb-3 text-stone-800">Today's Nutrition Tasks</h3>
                    {todayPlan?.nutrition?.map((mealName, index) => {
                        const taskKey = getTaskKeyFromString(mealName);
                        const recipeKey = getRecipeKeyFromMealName(mealName);
                        return (
                            <div key={index} className="task-item mb-2">
                                <p 
                                    onClick={() => handleMealClick(mealName)} 
                                    className={`text-sm cursor-pointer ${
                                        dailyTasksStatus[taskKey] 
                                            ? 'line-through text-stone-400' 
                                            : ''
                                    } ${DB.recipes[recipeKey] ? 'text-teal-600 hover:text-teal-700' : ''}`}
                                >
                                    {mealName}
                                </p>
                                <button 
                                    onClick={() => toggleTaskCompletion(taskKey)} 
                                    disabled={isUpdating}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        dailyTasksStatus[taskKey] 
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                            : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUpdating ? 'Updating...' : dailyTasksStatus[taskKey] ? 'Done ✔' : 'Mark Done'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="bg-teal-600 text-white p-6 rounded-lg mt-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">💡 Motivational Quote</h3>
                <p className="italic">{DB.affirmations[new Date().getDay() % DB.affirmations.length]}</p>
            </div>
            {showRecipeModal && selectedRecipe && (
                <RecipeModal 
                    recipe={selectedRecipe} 
                    onClose={() => setShowRecipeModal(false)} 
                />
            )}
        </TabContentWrapper>
    );
};

export default TodayOverview; 