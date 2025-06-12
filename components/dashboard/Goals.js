import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import TabContentWrapper from '../common/TabContentWrapper';

const Goals = () => {
    const { user, userData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({
        goalType: '',
        targetWeight: '',
        targetDate: '',
        description: '',
        milestones: []
    });

    useEffect(() => {
        if (userData?.goals) {
            setFormData(userData.goals);
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            const goalData = {
                ...formData,
                createdAt: new Date().toISOString(),
                status: 'active',
                progress: 0
            };

            if (isAddingNew) {
                await updateDoc(userRef, {
                    goals: arrayUnion(goalData)
                });
            } else {
                await updateDoc(userRef, {
                    goals: formData
                });
            }
            
            setIsEditing(false);
            setIsAddingNew(false);
        } catch (error) {
            console.error('Error updating goals:', error);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                goals: arrayRemove(userData.goals.find(g => g.id === goalId))
            });
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const calculateProgress = (goal) => {
        if (!goal || !userData?.weight) return 0;
        
        const startWeight = userData.weight;
        const targetWeight = parseFloat(goal.targetWeight);
        const currentWeight = parseFloat(userData.weight);
        
        if (goal.goalType === 'weight_loss') {
            const totalToLose = startWeight - targetWeight;
            const lost = startWeight - currentWeight;
            return Math.min(100, Math.max(0, (lost / totalToLose) * 100));
        } else if (goal.goalType === 'muscle_gain') {
            const totalToGain = targetWeight - startWeight;
            const gained = currentWeight - startWeight;
            return Math.min(100, Math.max(0, (gained / totalToGain) * 100));
        }
        return 0;
    };

    const getGoalStatus = (goal) => {
        if (!goal) return 'No goal set';
        
        const progress = calculateProgress(goal);
        const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return 'Goal period ended';
        if (progress >= 100) return 'Goal achieved!';
        return `${daysLeft} days remaining`;
    };

    const renderGoalForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                    Goal Type
                </label>
                <select
                    name="goalType"
                    value={formData.goalType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                >
                    <option value="">Select a goal</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                    Target Weight (kg)
                </label>
                <input
                    type="number"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    min="30"
                    max="300"
                    step="0.1"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                    Target Date
                </label>
                <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows="3"
                    placeholder="Describe your goal and motivation..."
                />
            </div>

            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    {isAddingNew ? 'Add Goal' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        setIsAddingNew(false);
                    }}
                    className="px-4 py-2 border border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
            </div>
        </form>
    );

    const renderGoalCard = (goal) => (
        <div key={goal.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-stone-800">
                        {goal.goalType.replace('_', ' ').toUpperCase()}
                    </h4>
                    <p className="text-sm text-stone-600 mt-1">{goal.description}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setFormData(goal);
                            setIsEditing(true);
                        }}
                        className="text-teal-600 hover:text-teal-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-stone-600">
                        <span>Current Weight: {userData.weight} kg</span>
                        <span>Target: {goal.targetWeight} kg</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5">
                        <div
                            className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(goal)}%` }}
                        />
                    </div>
                    <p className="text-sm text-stone-600 text-center">
                        {getGoalStatus(goal)}
                    </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm text-stone-600">
                        <p>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
                        <p>Progress: {Math.round(calculateProgress(goal))}%</p>
                        <p>Status: {goal.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <TabContentWrapper 
            title="Fitness Goals" 
            instruction="Set and track your fitness goals"
        >
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-stone-800">Your Goals</h3>
                        <button
                            onClick={() => {
                                setIsAddingNew(true);
                                setFormData({
                                    goalType: '',
                                    targetWeight: '',
                                    targetDate: '',
                                    description: '',
                                    milestones: []
                                });
                            }}
                            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            Add New Goal
                        </button>
                    </div>

                    {(isEditing || isAddingNew) ? (
                        renderGoalForm()
                    ) : (
                        <div className="space-y-4">
                            {userData?.goals?.length > 0 ? (
                                userData.goals.map(goal => renderGoalCard(goal))
                            ) : (
                                <p className="text-stone-600 text-center py-4">
                                    No goals set. Click "Add New Goal" to set your fitness goals.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-stone-800 mb-4">Goal Recommendations</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-stone-50 rounded-lg">
                            <h4 className="font-medium text-stone-800 mb-2">Weight Loss</h4>
                            <p className="text-sm text-stone-600">
                                • Aim for 0.5-1kg per week<br />
                                • Create a 500-1000 calorie deficit<br />
                                • Focus on high-protein meals<br />
                                • Combine cardio and strength training
                            </p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                            <h4 className="font-medium text-stone-800 mb-2">Muscle Gain</h4>
                            <p className="text-sm text-stone-600">
                                • Target 0.25-0.5kg per week<br />
                                • Maintain a 300-500 calorie surplus<br />
                                • Prioritize protein intake (1.6-2.2g per kg)<br />
                                • Progressive overload in training
                            </p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                            <h4 className="font-medium text-stone-800 mb-2">Endurance</h4>
                            <p className="text-sm text-stone-600">
                                • Gradually increase workout duration<br />
                                • Mix HIIT and steady-state cardio<br />
                                • Focus on proper recovery<br />
                                • Stay hydrated and maintain nutrition
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </TabContentWrapper>
    );
};

export default Goals; 