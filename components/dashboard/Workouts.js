import React from 'react';
import { DB } from '../../data/db';
import AccordionItem from '../common/AccordionItem';
import TabContentWrapper from '../common/TabContentWrapper';

const Workouts = () => {
    return (
        <TabContentWrapper 
            title="Workout Library" 
            instruction="Browse and learn about different workout routines"
        >
            <div className="space-y-4">
                {DB.workoutDetails.map(workout => (
                    <AccordionItem 
                        key={workout.id}
                        title={workout.name}
                        items={workout.exercises}
                        instructions={workout.instructions}
                        isWorkoutLibrary={true}
                    />
                ))}
            </div>
        </TabContentWrapper>
    );
};

export default Workouts; 