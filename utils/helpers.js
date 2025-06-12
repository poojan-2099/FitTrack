import { DB } from '../data/db';

export const getCyclicalPlanForDate = (date) => {
    const refDate = new Date(DB.referenceStartDate);
    refDate.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(targetDate - refDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let cycleIndex = diffDays % 7;
    if (targetDate < refDate) {
        cycleIndex = (7 - ((-diffDays) % 7)) % 7;
    }
    return {
        workout: DB.workoutCycle[cycleIndex],
        nutrition: DB.nutritionCycle[cycleIndex]
    };
};

export const getRecipeKeyFromMealName = (mealName) => {
    if (typeof mealName !== 'string' || !mealName) return '';
    const parts = mealName.split(':', 2);
    const namePartToProcess = parts.length > 1 && parts[1] ? parts[1] : parts[0];
    return namePartToProcess.trim().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, '');
};

export const getTaskKeyFromString = (str) => {
    if (typeof str !== 'string' || !str) return '';
    const parts = str.split(':', 2);
    const namePart = parts.length > 1 && parts[1] ? parts[1] : parts[0];
    return namePart.trim().split(" ")[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
};

export const formatFullDate = (date) => {
    return `${DB.daysOfWeek[date.getDay()]}, ${DB.monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}; 