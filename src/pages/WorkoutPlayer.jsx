import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadWorkouts, generateWorkout } from '../utils/data';

function WorkoutPlayer() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workouts = loadWorkouts();
  const workout = workouts.find(w => w._id === workoutId);
  
  const [components, setComponents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (workout && components.length === 0) {
      const generated = generateWorkout(workout);
      setComponents(generated);
      setTimeLeft(generated[0]?.duration || 0);
    }
  }, [workout, components.length]);

  useEffect(() => {
    if (isPlaying && isStarted && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next component
            if (currentIndex < components.length - 1) {
              const nextIndex = currentIndex + 1;
              setCurrentIndex(nextIndex);
              return components[nextIndex].duration;
            } else {
              // Workout complete
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isStarted, timeLeft, currentIndex, components]);

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600">Workout not found</p>
          <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:text-indigo-800">
            ← Back to Paths
          </button>
        </div>
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Loading workout...</p>
        </div>
      </div>
    );
  }

  const currentComponent = components[currentIndex];
  const nextComponent = currentIndex < components.length - 1 ? components[currentIndex + 1] : null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
    setIsPlaying(true);
  };

  const handlePausePlay = () => {
    if (!isStarted) {
      handleStart();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setTimeLeft(components[prevIndex].duration);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < components.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeLeft(components[nextIndex].duration);
      setIsPlaying(false);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit the workout?')) {
      navigate(`/workout/${workoutId}`);
    }
  };

  const isComplete = currentIndex === components.length - 1 && timeLeft === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{workout.title}</h1>
          <p className="text-gray-600">
            Component {currentIndex + 1} of {components.length}
          </p>
        </div>

        {isComplete ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-green-600 text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Workout Complete!</h2>
            <p className="text-gray-600 mb-8">Great job completing the workout!</p>
            <button
              onClick={() => navigate(`/workout/${workoutId}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
            >
              Back to Workout
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-indigo-600 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-2xl font-semibold text-gray-800 mb-2">
                  {currentComponent.type === 'warmup' && 'Warmup'}
                  {currentComponent.type === 'exercise' && currentComponent.exercise}
                  {currentComponent.type === 'rest' && currentComponent.label}
                </div>
                {currentComponent.type === 'exercise' && (
                  <div className="text-lg text-gray-600">
                    {currentComponent.reps} reps | Set {currentComponent.setNum}
                  </div>
                )}
              </div>

              {nextComponent && (
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Next:</p>
                  <p className="font-semibold text-gray-800">
                    {nextComponent.type === 'warmup' && 'Warmup'}
                    {nextComponent.type === 'exercise' && `${nextComponent.exercise} (${nextComponent.reps} reps)`}
                    {nextComponent.type === 'rest' && nextComponent.label}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handlePausePlay}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
              >
                {!isStarted ? 'Start' : isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === components.length - 1}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
              >
                Next
              </button>
              <button
                onClick={handleExit}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
              >
                Exit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkoutPlayer;

