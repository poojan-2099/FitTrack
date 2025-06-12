import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { mealPlans } from '../../data/mealPlans';
import { fetchNutritionData } from '../../utils/api';
import AccordionItem from '../common/AccordionItem';
import TabContentWrapper from '../common/TabContentWrapper';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Nutrition = () => {
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [nutritionData, setNutritionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedMeal) {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await fetchNutritionData(selectedMeal);
                    if (data?.totalNutrients) {
                        setNutritionData(data);
                    } else {
                        setError('Unable to fetch nutrition data for this meal. Please try another meal.');
                        setNutritionData(null);
                    }
                } catch (err) {
                    console.error('Error fetching nutrition data:', err);
                    setError('Error fetching nutrition data. Please try again.');
                    setNutritionData(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [selectedMeal]);

    const handleMealClick = (meal) => {
        setSelectedMeal(meal);
        setNutritionData(null);
    };

    const renderNutritionChart = () => {
        if (!nutritionData?.totalNutrients) return null;

        const nutrients = nutritionData.totalNutrients;
        const data = {
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [{
                data: [
                    nutrients.PROCNT?.quantity || 0,
                    nutrients.CHOCDF?.quantity || 0,
                    nutrients.FAT?.quantity || 0
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${Math.round(context.raw || 0)}g`
                    }
                }
            },
            cutout: '60%'
        };

        return (
            <div className="w-full max-w-xs mx-auto h-64">
                <Doughnut data={data} options={options} />
            </div>
        );
    };

    const renderNutritionFacts = () => {
        if (!nutritionData?.totalNutrients) return null;

        const nutrients = nutritionData.totalNutrients;
        const nutritionFacts = [
            { key: 'PROCNT', label: 'Protein' },
            { key: 'CHOCDF', label: 'Carbohydrates' },
            { key: 'FAT', label: 'Total Fat' },
            { key: 'FIBTG', label: 'Fiber' },
            { key: 'SUGAR', label: 'Sugar' }
        ];

        return (
            <div className="space-y-2">
                {nutritionFacts.map(({ key, label }) => (
                    <div key={key} className="flex justify-between text-sm">
                        <span className="text-stone-600">{label}</span>
                        <span className="text-stone-800 font-medium">
                            {Math.round(nutrients[key]?.quantity || 0)}g
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <TabContentWrapper 
            title="Nutrition Hub" 
            instruction="Track your daily nutrition and meal plans"
        >
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-4">Meal Plans</h3>
                    <div className="space-y-4">
                        {mealPlans?.map((plan, index) => (
                            <AccordionItem
                                key={index}
                                title={plan.title}
                                items={plan.meals}
                                onItemClick={handleMealClick}
                            />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-stone-800 mb-4">Nutrition Analysis</h3>
                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                            <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-center py-4 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    ) : selectedMeal ? (
                        <div className="space-y-6">
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-medium text-stone-800 mb-2">Selected Meal</h4>
                                <p className="text-stone-700">{selectedMeal}</p>
                            </div>

                            {nutritionData ? (
                                <>
                                    {renderNutritionChart()}
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="bg-stone-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-stone-800 mb-2">Calories</h5>
                                            <p className="text-2xl font-semibold text-teal-600">
                                                {Math.round(nutritionData.calories || 0)}
                                            </p>
                                        </div>
                                        <div className="bg-stone-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-stone-800 mb-2">Protein</h5>
                                            <p className="text-2xl font-semibold text-teal-600">
                                                {Math.round(nutritionData.totalNutrients?.PROCNT?.quantity || 0)}g
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h5 className="font-medium text-stone-800 mb-2">Nutrition Facts</h5>
                                        {renderNutritionFacts()}
                                    </div>
                                </>
                            ) : (
                                <p className="text-stone-600 text-center py-4">
                                    Loading nutrition information...
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-stone-600 text-center py-4">
                            Select a meal to view its nutritional information
                        </p>
                    )}
                </div>
            </div>
        </TabContentWrapper>
    );
};

export default Nutrition; 