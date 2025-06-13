import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { DB } from '../../data/db';
import { getCyclicalPlanForDate, getRecipeKeyFromMealName, getTaskKeyFromString } from '../../utils/helpers';
import { getDailyQuote } from '../../utils/api';
import RecipeModal from '../common/RecipeModal';
import TabContentWrapper from '../common/TabContentWrapper';
import { useAuth } from '../../contexts/AuthContext';
import Confetti from 'react-confetti';

const TodayOverview = ({ userData }) => {
    const { user } = useAuth();
    const [todayPlan, setTodayPlan] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [dailyQuote, setDailyQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingMeals, setIsEditingMeals] = useState(false);
    const [customMeals, setCustomMeals] = useState([]);
    const [newMeal, setNewMeal] = useState({ type: 'Breakfast', name: '' });
    const [goalProgress, setGoalProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

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

        // Load custom meals if they exist
        if (userData?.customMeals) {
            setCustomMeals(userData.customMeals);
        }

        // Calculate initial goal progress
        calculateGoalProgress();

        // Add window resize listener for confetti
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        // Load daily quote
        const loadQuote = async () => {
            try {
                setIsLoading(true);
                const quote = await getDailyQuote();
                if (quote && quote.quote) {
                    setDailyQuote(quote);
                }
            } catch (error) {
                console.error('Error loading quote:', error);
                // Set a fallback quote on error
                setDailyQuote({
                    quote: "Your body can stand almost anything. It's your mind you have to convince.",
                    author: "Andrew Murphy",
                    tags: ["fitness", "mindset"]
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadQuote();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [userData]);

    const calculateGoalProgress = () => {
        if (!userData?.goals || !userData?.taskLogs) return;

        const today = new Date().toISOString().split('T')[0];
        const todayTasks = userData.taskLogs[today] || {};
        
        // Count completed tasks
        const completedTasks = Object.values(todayTasks).filter(status => status).length;
        const totalTasks = Object.keys(todayTasks).length;
        
        // Calculate progress percentage
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        setGoalProgress(progress);

        // Check if all tasks are completed and trigger confetti
        if (progress === 100 && completedTasks > 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }

        return progress;
    };

    const updateGoalProgress = async (progress) => {
        if (!user || !userData?.goals) return;

        try {
            const userRef = doc(db, "users", user.uid);
            const today = new Date().toISOString().split('T')[0];
            
            // Update goals in Firebase
            const updatedGoals = userData.goals.map(goal => {
                if (goal.goalType === 'endurance' || goal.goalType === 'strength') {
                    return {
                        ...goal,
                        progress,
                        lastUpdated: new Date().toISOString(),
                        status: progress >= 100 ? 'completed' : 'active',
                        completedAt: progress >= 100 ? new Date().toISOString() : goal.completedAt
                    };
                }
                return goal;
            });

            await updateDoc(userRef, {
                goals: updatedGoals,
                [`goalProgress.${today}`]: {
                    progress,
                    lastUpdated: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error updating goal progress:', error);
        }
    };

    const handleAddCustomMeal = async () => {
        if (!newMeal.name.trim() || !user || !userData || isUpdating) return;
        
        try {
            setIsUpdating(true);
            const mealString = `${newMeal.type}: ${newMeal.name}`;
            const updatedCustomMeals = [...customMeals, mealString];
            
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                customMeals: arrayUnion(mealString)
            });
            
            setCustomMeals(updatedCustomMeals);
            setNewMeal({ type: 'Breakfast', name: '' });
        } catch (error) {
            console.error('Error adding custom meal:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveCustomMeal = async (mealToRemove) => {
        if (!user || !userData || isUpdating) return;
        
        try {
            setIsUpdating(true);
            const updatedCustomMeals = customMeals.filter(meal => meal !== mealToRemove);
            
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                customMeals: updatedCustomMeals
            });
            
            setCustomMeals(updatedCustomMeals);
        } catch (error) {
            console.error('Error removing custom meal:', error);
        } finally {
            setIsUpdating(false);
        }
    };

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
            
            // Update task logs
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

            // Calculate and update goal progress
            const progress = calculateGoalProgress();
            await updateGoalProgress(progress);
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
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            {/* Daily Motivation Section - Moved to top */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-8 rounded-lg mb-6 shadow-lg">
                <h3 className="font-semibold text-xl mb-4">💡 Daily Motivation</h3>
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-4 bg-teal-500 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-teal-500 rounded w-1/2"></div>
                    </div>
                ) : dailyQuote ? (
                    <div className="space-y-4">
                        <blockquote className="text-xl italic font-light">
                            "{dailyQuote.quote}"
                        </blockquote>
                        <p className="text-sm opacity-90">- {dailyQuote.author}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {dailyQuote.tags.map((tag, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-teal-500 bg-opacity-30 text-white rounded-full text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Welcome and Quick Stats Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-stone-800">
                        Welcome, {userData?.displayName || userData?.email?.split('@')[0] || 'User'}!
                    </h3>
                    <p className="text-stone-600">Let's make today count towards your fitness goals.</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-stone-800">Quick Stats</h3>
                    <div className="space-y-2">
                        <p className="text-stone-600">Height: {userData?.height || 'Not set'} cm</p>
                        <p className="text-stone-600">Weight: {userData?.weight || 'Not set'} kg</p>
                        <p className="text-stone-600">Goal: {userData?.goal ? userData.goal.replace('_', ' ').toUpperCase() : 'Not set'}</p>
                        <div className="mt-2">
                            <p className="text-sm text-stone-600 mb-1">Today's Progress</p>
                            <div className="w-full bg-stone-200 rounded-full h-2">
                                <div
                                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${goalProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-stone-500 mt-1">{Math.round(goalProgress)}% of daily tasks completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
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
                <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-stone-800">Today's Nutrition Tasks</h3>
                        <button
                            onClick={() => setIsEditingMeals(!isEditingMeals)}
                            className="text-sm text-teal-600 hover:text-teal-700"
                        >
                            {isEditingMeals ? 'Done Editing' : 'Edit Meals'}
                        </button>
                    </div>

                    {isEditingMeals ? (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <select
                                    value={newMeal.type}
                                    onChange={(e) => setNewMeal(prev => ({ ...prev, type: e.target.value }))}
                                    className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm"
                                >
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                                <input
                                    type="text"
                                    value={newMeal.name}
                                    onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter meal name"
                                    className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={handleAddCustomMeal}
                                    disabled={isUpdating || !newMeal.name.trim()}
                                    className="px-3 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700 disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-2">
                                {customMeals.map((meal, index) => (
                                    <div key={index} className="flex items-center justify-between bg-stone-50 p-2 rounded-md">
                                        <span className="text-sm">{meal}</span>
                                        <button
                                            onClick={() => handleRemoveCustomMeal(meal)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {[...(todayPlan?.nutrition || []), ...customMeals].map((mealName, index) => {
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
                    )}
                </div>
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