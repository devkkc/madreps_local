import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadWorkouts, calibrateWorkout } from '../utils/data';

function Calibrate() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workouts = loadWorkouts();
  const workout = workouts.find(w => w._id === workoutId);
  const [feedback, setFeedback] = useState(5);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = () => {
    calibrateWorkout(workout, feedback);
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/workout/${workoutId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/workout/${workoutId}`)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
          >
            ← Back to {workout.title}
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Calibrate Workout</h1>
        </div>

        {submitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <p className="text-xl font-semibold text-gray-800">Calibration saved!</p>
            <p className="text-gray-600 mt-2">Redirecting...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-lg text-gray-700 mb-6">
              How was this workout? Rate it from 1 (too easy) to 10 (too hard).
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Feedback: {feedback}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={feedback}
                onChange={(e) => setFeedback(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Too Easy)</span>
                <span>10 (Too Hard)</span>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Based on your feedback, the workout's max reps (1s_max) will be adjusted
                using the formula: new_1s_max = ceil(max(1, old_1s_max × √(feedback/8)))
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
              >
                Submit Calibration
              </button>
              <button
                onClick={() => navigate(`/workout/${workoutId}`)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calibrate;

