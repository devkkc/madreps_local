// Import workouts data - Vite handles JSON imports directly
import workoutsData from '../../workouts.json';

// Parse MongoDB-style JSON to normal format
function parseWorkout(workout) {
  return {
    _id: workout._id?.$oid || workout._id,
    path: workout.path,
    title: workout.title,
    tags: workout.tags || [],
    rest_between_sets: typeof workout.rest_between_sets === 'object' 
      ? parseFloat(workout.rest_between_sets.$numberInt || workout.rest_between_sets.$numberDouble || workout.rest_between_sets)
      : workout.rest_between_sets,
    rest_between_exercises: typeof workout.rest_between_exercises === 'object'
      ? parseInt(workout.rest_between_exercises.$numberInt)
      : workout.rest_between_exercises,
    freq_factor: typeof workout.freq_factor === 'object'
      ? parseInt(workout.freq_factor.$numberInt)
      : workout.freq_factor,
    sets: typeof workout.sets === 'object'
      ? parseInt(workout.sets.$numberInt)
      : workout.sets,
    workout: workout.workout.map(ex => ({
      name: ex.name,
      '1s_max': typeof ex['1s_max'] === 'object'
        ? parseInt(ex['1s_max'].$numberInt)
        : ex['1s_max'],
      upper: typeof ex.upper === 'object'
        ? parseFloat(ex.upper.$numberDouble)
        : ex.upper,
      lower: typeof ex.lower === 'object'
        ? parseFloat(ex.lower.$numberDouble)
        : ex.lower,
      seconds_per_rep: typeof ex.seconds_per_rep === 'object'
        ? parseFloat(ex.seconds_per_rep.$numberInt || ex.seconds_per_rep.$numberDouble)
        : ex.seconds_per_rep,
    })),
    warmup: workout.warmup || 5, // Default warmup time in minutes
    shuffle: workout.shuffle !== undefined ? workout.shuffle : true, // Default to shuffle
  };
}

// Load workouts from JSON and localStorage
export function loadWorkouts() {
  const stored = localStorage.getItem('user_workouts');
  let userWorkouts = stored ? JSON.parse(stored) : [];
  
  // Parse initial workouts from JSON
  const initialWorkouts = workoutsData.map(parseWorkout);
  
  // Merge: use user_workouts if exists, otherwise use initial
  const allWorkouts = [...initialWorkouts];
  
  // Update with user modifications
  userWorkouts.forEach(userWorkout => {
    const index = allWorkouts.findIndex(w => w._id === userWorkout._id);
    if (index >= 0) {
      allWorkouts[index] = { ...allWorkouts[index], ...userWorkout };
    } else {
      allWorkouts.push(userWorkout);
    }
  });
  
  return allWorkouts;
}

// Save workout to localStorage
export function saveWorkout(workout) {
  const stored = localStorage.getItem('user_workouts');
  let userWorkouts = stored ? JSON.parse(stored) : [];
  
  const index = userWorkouts.findIndex(w => w._id === workout._id);
  if (index >= 0) {
    userWorkouts[index] = workout;
  } else {
    userWorkouts.push(workout);
  }
  
  localStorage.setItem('user_workouts', JSON.stringify(userWorkouts));
}

// Get paths with workout counts
export function getPaths() {
  const workouts = loadWorkouts();
  const pathMap = {};
  
  workouts.forEach(workout => {
    if (!pathMap[workout.path]) {
      pathMap[workout.path] = 0;
    }
    pathMap[workout.path]++;
  });
  
  return Object.entries(pathMap).map(([path, count]) => ({ path, count }));
}

// Get workouts for a path
export function getWorkoutsByPath(path) {
  return loadWorkouts().filter(w => w.path === path);
}

// Generate workout from config
export function generateWorkout(workoutConfig) {
  const { sets, workout: exercises, rest_between_sets, rest_between_exercises, warmup, shuffle } = workoutConfig;
  const components = [];
  
  // Add warmup
  components.push({
    type: 'warmup',
    duration: warmup * 60, // Convert to seconds
    label: 'Warmup',
  });
  
  // Generate sets
  for (let setNum = 1; setNum <= sets; setNum++) {
    // Shuffle exercises if enabled
    const setExercises = shuffle 
      ? [...exercises].sort(() => Math.random() - 0.5)
      : [...exercises];
    
    // Add exercises for this set
    setExercises.forEach((exercise, exIndex) => {
      // Calculate reps: randbetween(1s_max - lower*1s_max, 1s_max + upper*1s_max)
      const oneSMax = exercise['1s_max'];
      const lower = exercise.lower;
      const upper = exercise.upper;
      const minReps = Math.max(1, Math.floor(oneSMax - lower * oneSMax));
      const maxReps = Math.floor(oneSMax + upper * oneSMax);
      const reps = Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps;
      
      // Calculate duration: ceil(reps * seconds_per_rep)
      const duration = Math.ceil(reps * exercise.seconds_per_rep);
      
      components.push({
        type: 'exercise',
        exercise: exercise.name,
        reps,
        duration,
        setNum,
        exerciseIndex: exIndex,
      });
      
      // Add rest between exercises (except after last exercise in set)
      if (exIndex < setExercises.length - 1) {
        components.push({
          type: 'rest',
          duration: rest_between_exercises,
          label: 'Rest',
          setNum,
        });
      }
    });
    
    // Add rest between sets (except after last set)
    if (setNum < sets) {
      // Calculate rest: ceil(rest_between_sets * (1 + abs(sin(180 * i/sets))))
      // Convert degrees to radians: 180 degrees = π radians
      const restMinutes = rest_between_sets * (1 + Math.abs(Math.sin((180 * setNum) / sets * Math.PI / 180)));
      const restSeconds = Math.ceil(restMinutes * 60);
      
      components.push({
        type: 'rest',
        duration: restSeconds,
        label: 'Rest Between Sets',
        setNum,
      });
    }
  }
  
  return components;
}

// Calibrate workout: update 1s_max based on feedback
export function calibrateWorkout(workout, feedback) {
  const updatedWorkout = {
    ...workout,
    workout: workout.workout.map(exercise => ({
      ...exercise,
      '1s_max': Math.ceil(Math.max(1, exercise['1s_max'] * Math.sqrt(feedback / 8))),
    })),
  };
  
  saveWorkout(updatedWorkout);
  return updatedWorkout;
}

