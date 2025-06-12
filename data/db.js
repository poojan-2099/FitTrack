export const DB = {
    // Reference date for cyclical plans
    referenceStartDate: '2024-01-01',
    
    // Days and months for date formatting
    daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayShortNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    
    // Workout cycle (7-day rotation)
    workoutCycle: [
        { id: 'strength', name: 'Strength Training', tag: 'Strength', color: 'bg-blue-100 text-blue-800' },
        { id: 'cardio', name: 'Cardio Session', tag: 'Cardio', color: 'bg-green-100 text-green-800' },
        { id: 'rest', name: 'Active Recovery', tag: 'Rest', color: 'bg-purple-100 text-purple-800' },
        { id: 'strength', name: 'Strength Training', tag: 'Strength', color: 'bg-blue-100 text-blue-800' },
        { id: 'cardio', name: 'Cardio Session', tag: 'Cardio', color: 'bg-green-100 text-green-800' },
        { id: 'rest', name: 'Active Recovery', tag: 'Rest', color: 'bg-purple-100 text-purple-800' },
        { id: 'rest', name: 'Rest Day', tag: 'Rest', color: 'bg-gray-100 text-gray-800' }
    ],
    
    // Nutrition cycle (7-day rotation)
    nutritionCycle: [
        [
            'Breakfast: Protein Oatmeal',
            'Lunch: Grilled Chicken Salad',
            'Dinner: Baked Salmon with Vegetables'
        ],
        [
            'Breakfast: Greek Yogurt with Berries',
            'Lunch: Turkey Wrap',
            'Dinner: Lean Beef Stir-Fry'
        ],
        [
            'Breakfast: Protein Smoothie',
            'Lunch: Quinoa Bowl',
            'Dinner: Grilled Fish with Sweet Potato'
        ],
        [
            'Breakfast: Egg White Omelette',
            'Lunch: Tuna Salad',
            'Dinner: Chicken Stir-Fry'
        ],
        [
            'Breakfast: Protein Pancakes',
            'Lunch: Grilled Chicken Wrap',
            'Dinner: Baked Cod with Vegetables'
        ],
        [
            'Breakfast: Protein Shake',
            'Lunch: Turkey and Avocado Salad',
            'Dinner: Lean Beef with Rice'
        ],
        [
            'Breakfast: Greek Yogurt with Granola',
            'Lunch: Grilled Chicken Salad',
            'Dinner: Baked Salmon with Vegetables'
        ]
    ],
    
    // Workout details
    workoutDetails: [
        {
            id: 'strength',
            name: 'Strength Training',
            exercises: [
                'Squats: 3 sets x 12 reps',
                'Deadlifts: 3 sets x 10 reps',
                'Bench Press: 3 sets x 10 reps',
                'Pull-ups: 3 sets x 8 reps',
                'Shoulder Press: 3 sets x 12 reps'
            ],
            instructions: 'Focus on proper form and controlled movements. Rest 60-90 seconds between sets.'
        },
        {
            id: 'cardio',
            name: 'Cardio Session',
            exercises: [
                'Warm-up: 5 minutes light jogging',
                'High-intensity intervals: 30 seconds sprint, 90 seconds walk (repeat 8 times)',
                'Cool-down: 5 minutes light jogging'
            ],
            instructions: 'Maintain proper breathing throughout. Adjust intensity based on your fitness level.'
        },
        {
            id: 'rest',
            name: 'Active Recovery',
            exercises: [
                'Light stretching: 10-15 minutes',
                'Foam rolling: 10 minutes',
                'Light walking: 20-30 minutes'
            ],
            instructions: 'Focus on recovery and mobility. Stay active but keep intensity low.'
        }
    ],
    
    // Meal ideas by category
    mealIdeas: [
        {
            name: 'High Protein',
            items: [
                'Grilled Chicken Breast',
                'Greek Yogurt with Berries',
                'Protein Smoothie',
                'Egg White Omelette',
                'Tuna Salad'
            ]
        },
        {
            name: 'Low Carb',
            items: [
                'Cauliflower Rice Bowl',
                'Zucchini Noodles with Pesto',
                'Lettuce Wraps',
                'Avocado Salad',
                'Grilled Fish with Vegetables'
            ]
        },
        {
            name: 'Vegetarian',
            items: [
                'Quinoa Buddha Bowl',
                'Lentil Soup',
                'Tofu Stir-Fry',
                'Chickpea Salad',
                'Vegetable Curry'
            ]
        }
    ],
    
    // Recipes
    recipes: {
        'protein oatmeal': {
            name: 'Protein Oatmeal',
            ingredients: [
                '1 cup rolled oats',
                '1 scoop protein powder',
                '1 cup almond milk',
                '1 tablespoon honey',
                '1/4 cup mixed berries'
            ],
            instructions: 'Cook oats with almond milk. Stir in protein powder and honey. Top with berries.'
        },
        'grilled chicken salad': {
            name: 'Grilled Chicken Salad',
            ingredients: [
                '6 oz chicken breast',
                '2 cups mixed greens',
                '1/4 cup cherry tomatoes',
                '1/4 cucumber',
                '2 tablespoons olive oil',
                '1 tablespoon balsamic vinegar'
            ],
            instructions: 'Grill chicken breast. Chop vegetables. Combine all ingredients and toss with dressing.'
        }
    },
    
    // Daily schedule reminders
    dailyScheduleReminders: [
        { hour: 7, minute: 0, message: 'Morning workout time!' },
        { hour: 12, minute: 0, message: 'Time for lunch and meal prep' },
        { hour: 17, minute: 0, message: 'Evening workout session' },
        { hour: 20, minute: 0, message: 'Prepare for tomorrow' }
    ],
    
    // Affirmations
    affirmations: [
        'Every step forward is progress.',
        'Your body is capable of amazing things.',
        'Consistency is key to success.',
        'You are stronger than you think.',
        'Small changes lead to big results.',
        'Your health is an investment, not an expense.',
        'You\'ve got this!'
    ]
}; 