import React, { useState } from 'react';
import TabContentWrapper from '../common/TabContentWrapper';

const Calculators = ({ userData }) => {
    const [bmiUnits, setBmiUnits] = useState('metric');
    const [bmiResult, setBmiResult] = useState(null);
    const [ncUnits, setNcUnits] = useState('metric');
    const [ncResult, setNcResult] = useState(null);

    const handleBmiSubmit = (e) => {
        e.preventDefault();
        let weightKg, heightCm;
        if (bmiUnits === 'metric') {
            weightKg = parseFloat(e.target.elements['bmi-weight-kg'].value);
            heightCm = parseFloat(e.target.elements['bmi-height-cm'].value);
        } else {
            const weightLbs = parseFloat(e.target.elements['bmi-weight-lbs'].value);
            const heightFt = parseFloat(e.target.elements['bmi-height-ft'].value) || 0;
            const heightIn = parseFloat(e.target.elements['bmi-height-in'].value) || 0;
            if (weightLbs > 0) weightKg = weightLbs * 0.453592;
            if (heightFt >= 0 || heightIn > 0) heightCm = (heightFt * 30.48) + (heightIn * 2.54); else heightCm = 0;
        }

        if (weightKg > 0 && heightCm > 0) {
            const heightInMeters = heightCm / 100;
            const bmi = weightKg / (heightInMeters * heightInMeters);
            let category = '';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 24.9) category = 'Normal weight';
            else if (bmi < 29.9) category = 'Overweight';
            else category = 'Obesity';
            setBmiResult({ bmi: bmi.toFixed(1), category });
        } else {
            setBmiResult({ error: "Please enter valid weight and height." });
        }
    };

    const handleNutritionSubmit = (e) => {
        e.preventDefault();
        const age = parseInt(e.target.elements['nc-age'].value);
        const sex = e.target.elements['nc-sex'].value;
        const activityMultiplier = parseFloat(e.target.elements['nc-activity'].value);
        const goal = e.target.elements['nc-goal'].value;
        
        let weightKg, heightCm;
        if (ncUnits === 'metric') {
            weightKg = parseFloat(e.target.elements['nc-weight-kg'].value);
            heightCm = parseFloat(e.target.elements['nc-height-cm'].value);
        } else {
            const weightLbs = parseFloat(e.target.elements['nc-weight-lbs'].value);
            const heightFt = parseFloat(e.target.elements['nc-height-ft'].value) || 0;
            const heightIn = parseFloat(e.target.elements['nc-height-in'].value) || 0;
            if (weightLbs > 0) weightKg = weightLbs * 0.453592;
            if (heightFt >= 0 || heightIn > 0) heightCm = (heightFt * 30.48) + (heightIn * 2.54); else heightCm = 0;
        }

        if (age > 0 && weightKg > 0 && heightCm > 0) {
            let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
            bmr += (sex === 'male' ? 5 : -161);
            const tdee = bmr * activityMultiplier;
            
            let calorieAdjust = 0;
            if (goal.startsWith('lose_')) calorieAdjust = -parseFloat(goal.split('_')[1]) * 1000 * 7 / 7; 
            else if (goal.startsWith('gain_')) calorieAdjust = parseFloat(goal.split('_')[1]) * 1000 * 7 / 7; 
            
            const targetCalories = tdee + calorieAdjust;

            const proteinGrams = Math.round((targetCalories * 0.35) / 4); 
            const carbGrams = Math.round((targetCalories * 0.40) / 4);   
            const fatGrams = Math.round((targetCalories * 0.25) / 9);     

            setNcResult({ bmr, tdee, targetCalories, proteinGrams, carbGrams, fatGrams });
        } else {
            setNcResult({ error: "Please enter valid age, weight, and height." });
        }
    };

    return (
        <TabContentWrapper 
            title="Fitness Calculators" 
            instruction="Calculate your BMI and nutrition needs"
        >
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="text-xl font-semibold mb-4 text-stone-800">BMI Calculator</h3>
                    <div className="flex space-x-2 mb-4">
                        <button 
                            onClick={() => setBmiUnits('metric')} 
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                bmiUnits === 'metric' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            }`}
                        >
                            Metric (kg/cm)
                        </button>
                        <button 
                            onClick={() => setBmiUnits('imperial')} 
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                bmiUnits === 'imperial' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            }`}
                        >
                            Imperial (lbs/ft,in)
                        </button>
                    </div>
                    <form onSubmit={handleBmiSubmit} className="space-y-4">
                        {bmiUnits === 'metric' ? (
                            <>
                                <div>
                                    <label htmlFor="bmi-weight-kg" className="block text-sm font-medium text-stone-700 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="bmi-weight-kg" 
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        step="0.1" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="bmi-height-cm" className="block text-sm font-medium text-stone-700 mb-1">
                                        Height (cm)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="bmi-height-cm" 
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required 
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="bmi-weight-lbs" className="block text-sm font-medium text-stone-700 mb-1">
                                        Weight (lbs)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="bmi-weight-lbs" 
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        step="0.1" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Height</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="number" 
                                            name="bmi-height-ft" 
                                            placeholder="ft" 
                                            className="w-1/2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            name="bmi-height-in" 
                                            placeholder="in" 
                                            min="0" 
                                            max="11" 
                                            className="w-1/2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required 
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <button 
                            type="submit" 
                            className="w-full bg-teal-600 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            Calculate BMI
                        </button>
                    </form>
                    {bmiResult && (
                        <div className="mt-4 p-4 bg-white rounded-md border border-stone-200">
                            {bmiResult.error ? (
                                <p className="text-red-600">{bmiResult.error}</p>
                            ) : (
                                <>
                                    <h4 className="font-semibold mb-2">Your BMI: {bmiResult.bmi}</h4>
                                    <p>Category: {bmiResult.category}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                    <h3 className="text-xl font-semibold mb-4 text-stone-800">Nutrition Calculator</h3>
                    <div className="flex space-x-2 mb-4">
                        <button 
                            onClick={() => setNcUnits('metric')} 
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                ncUnits === 'metric' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            }`}
                        >
                            Metric (kg/cm)
                        </button>
                        <button 
                            onClick={() => setNcUnits('imperial')} 
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                ncUnits === 'imperial' 
                                    ? 'bg-teal-600 text-white' 
                                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                            }`}
                        >
                            Imperial (lbs/ft,in)
                        </button>
                    </div>
                    <form onSubmit={handleNutritionSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="nc-age" className="block text-sm font-medium text-stone-700 mb-1">
                                Age (years)
                            </label>
                            <input 
                                type="number" 
                                name="nc-age" 
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required 
                                min="15" 
                                max="100" 
                            />
                        </div>
                        <div>
                            <label htmlFor="nc-sex" className="block text-sm font-medium text-stone-700 mb-1">
                                Sex
                            </label>
                            <select 
                                name="nc-sex" 
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        {ncUnits === 'metric' ? (
                            <>
                                <div>
                                    <label htmlFor="nc-weight-kg" className="block text-sm font-medium text-stone-700 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="nc-weight-kg" 
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        step="0.1" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nc-height-cm" className="block text-sm font-medium text-stone-700 mb-1">
                                        Height (cm)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="nc-height-cm" 
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required 
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="nc-weight-lbs" className="block text-sm font-medium text-stone-700 mb-1">
                                        Weight (lbs)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="nc-weight-lbs" 
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        step="0.1" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Height</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="number" 
                                            name="nc-height-ft" 
                                            placeholder="ft" 
                                            className="w-1/2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required 
                                        />
                                        <input 
                                            type="number" 
                                            name="nc-height-in" 
                                            placeholder="in" 
                                            min="0" 
                                            max="11" 
                                            className="w-1/2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required 
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="nc-activity" className="block text-sm font-medium text-stone-700 mb-1">
                                Activity Level
                            </label>
                            <select 
                                name="nc-activity" 
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required
                            >
                                <option value="1.2">Sedentary (little or no exercise)</option>
                                <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                                <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
                                <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                                <option value="1.9">Extra active (very hard exercise & physical job)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="nc-goal" className="block text-sm font-medium text-stone-700 mb-1">
                                Goal
                            </label>
                            <select 
                                name="nc-goal" 
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required
                            >
                                <option value="lose_0.5">Lose 0.5 kg/week</option>
                                <option value="lose_0.25">Lose 0.25 kg/week</option>
                                <option value="maintain">Maintain weight</option>
                                <option value="gain_0.25">Gain 0.25 kg/week</option>
                                <option value="gain_0.5">Gain 0.5 kg/week</option>
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-teal-600 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            Calculate Nutrition Needs
                        </button>
                    </form>
                    {ncResult && (
                        <div className="mt-4 p-4 bg-white rounded-md border border-stone-200">
                            {ncResult.error ? (
                                <p className="text-red-600">{ncResult.error}</p>
                            ) : (
                                <>
                                    <h4 className="font-semibold mb-2">Your Results:</h4>
                                    <div className="space-y-2 text-sm">
                                        <p>BMR: {Math.round(ncResult.bmr)} calories/day</p>
                                        <p>TDEE: {Math.round(ncResult.tdee)} calories/day</p>
                                        <p>Target Calories: {Math.round(ncResult.targetCalories)} calories/day</p>
                                        <div className="mt-4">
                                            <h5 className="font-semibold mb-2">Macro Targets:</h5>
                                            <p>Protein: {ncResult.proteinGrams}g</p>
                                            <p>Carbs: {ncResult.carbGrams}g</p>
                                            <p>Fats: {ncResult.fatGrams}g</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </TabContentWrapper>
    );
};

export default Calculators; 