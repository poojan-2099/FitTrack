export const DB = {
    referenceStartDate: '2024-01-01',
    daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayShortNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    workoutCycle: [
        { id: 'strength', name: 'Strength Training', tag: 'Strength', color: 'teal' },
        { id: 'cardio', name: 'Cardio Session', tag: 'Cardio', color: 'blue' },
        { id: 'rest', name: 'Rest Day', tag: 'Rest', color: 'gray' },
        { id: 'strength', name: 'Strength Training', tag: 'Strength', color: 'teal' },
        { id: 'cardio', name: 'Cardio Session', tag: 'Cardio', color: 'blue' },
        { id: 'hiit', name: 'HIIT Workout', tag: 'HIIT', color: 'red' },
        { id: 'rest', name: 'Rest Day', tag: 'Rest', color: 'gray' }
    ],
    nutritionCycle: [
        [
            'Breakfast: Protein Oatmeal',
            'Lunch: Grilled Chicken Salad',
            'Dinner: Salmon with Vegetables'
        ],
        [
            'Breakfast: Greek Yogurt with Berries',
            'Lunch: Turkey Wrap',
            'Dinner: Lean Beef Stir-Fry'
        ],
        [
            'Breakfast: Avocado Toast',
            'Lunch: Quinoa Bowl',
            'Dinner: Grilled Fish with Sweet Potato'
        ],
        [
            'Breakfast: Protein Smoothie',
            'Lunch: Tuna Salad',
            'Dinner: Chicken Stir-Fry'
        ],
        [
            'Breakfast: Egg White Omelette',
            'Lunch: Grilled Chicken Wrap',
            'Dinner: Lean Beef with Vegetables'
        ],
        [
            'Breakfast: Protein Pancakes',
            'Lunch: Salmon Salad',
            'Dinner: Turkey Stir-Fry'
        ],
        [
            'Breakfast: Greek Yogurt Parfait',
            'Lunch: Grilled Fish Wrap',
            'Dinner: Chicken with Sweet Potato'
        ]
    ],
    workoutDetails: [
        {
            id: 'strength',
            name: 'Strength Training',
            instructions: 'Focus on compound movements and progressive overload. Rest 2-3 minutes between sets.',
            exercises: [
                'Squats: 4 sets x 8-12 reps',
                'Deadlifts: 4 sets x 8-12 reps',
                'Bench Press: 4 sets x 8-12 reps',
                'Overhead Press: 3 sets x 8-12 reps',
                'Barbell Rows: 3 sets x 8-12 reps'
            ]
        },
        {
            id: 'cardio',
            name: 'Cardio Session',
            instructions: 'Maintain a moderate intensity throughout the session. Stay hydrated.',
            exercises: [
                '5-minute warm-up',
                '20 minutes steady-state cardio',
                '5-minute cool-down',
                'Stretching routine'
            ]
        },
        {
            id: 'hiit',
            name: 'HIIT Workout',
            instructions: 'Alternate between high-intensity intervals and rest periods.',
            exercises: [
                '30 seconds sprint',
                '30 seconds rest',
                '30 seconds burpees',
                '30 seconds rest',
                '30 seconds mountain climbers',
                '30 seconds rest',
                'Repeat 5 times'
            ]
        },
        {
            id: 'rest',
            name: 'Rest Day',
            instructions: 'Focus on recovery and light activities.',
            exercises: [
                'Light stretching',
                'Walking',
                'Foam rolling',
                'Hydration focus'
            ]
        }
    ],
    mealIdeas: [
        {
            name: 'High Protein',
            items: [
                'Grilled Chicken Breast with Quinoa',
                'Salmon with Sweet Potato',
                'Greek Yogurt with Berries',
                'Protein Smoothie Bowl',
                'Egg White Omelette with Vegetables'
            ]
        },
        {
            name: 'Low Carb',
            items: [
                'Cauliflower Rice Stir-Fry',
                'Zucchini Noodles with Pesto',
                'Lettuce Wraps with Turkey',
                'Avocado and Egg Salad',
                'Grilled Fish with Vegetables'
            ]
        },
        {
            name: 'Vegetarian',
            items: [
                'Lentil and Vegetable Curry',
                'Quinoa Buddha Bowl',
                'Chickpea and Spinach Stew',
                'Tofu Stir-Fry',
                'Black Bean and Sweet Potato Bowl'
            ]
        }
    ],
    recipes: {
        'Protein Oatmeal': {
            name: 'Protein Oatmeal',
            ingredients: [
                '1 cup rolled oats',
                '1 scoop protein powder',
                '1 cup almond milk',
                '1 tablespoon honey',
                '1/4 cup mixed berries',
                '1 tablespoon chia seeds'
            ],
            instructions: '1. Cook oats with almond milk\n2. Stir in protein powder\n3. Top with berries and chia seeds\n4. Drizzle with honey'
        },
        'Grilled Chicken Salad': {
            name: 'Grilled Chicken Salad',
            ingredients: [
                '200g chicken breast',
                '2 cups mixed greens',
                '1/4 cucumber',
                '1/4 red onion',
                '1/4 avocado',
                '2 tablespoons olive oil',
                '1 tablespoon balsamic vinegar'
            ],
            instructions: '1. Grill chicken breast\n2. Chop vegetables\n3. Combine in bowl\n4. Dress with olive oil and vinegar'
        }
    },
    dailyScheduleReminders: [
        { hour: 7, minute: 0, message: 'Morning workout time!' },
        { hour: 12, minute: 0, message: 'Time for lunch and meal prep' },
        { hour: 17, minute: 0, message: 'Evening workout session' },
        { hour: 20, minute: 0, message: 'Prepare for tomorrow' }
    ],
    affirmations: [
        'Every step forward is progress.',
        'Your body can do amazing things.',
        'Consistency is key to success.',
        'You are stronger than you think.',
        'Small steps lead to big changes.',
        'Your health is an investment.',
        'Youve got this!'
    ]
};