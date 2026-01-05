import { useParams, useNavigate } from 'react-router-dom';
import { loadWorkouts } from '../utils/data';

function WorkoutPreview() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workouts = loadWorkouts();
  const workout = workouts.find(w => w._id === workoutId);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/path/${encodeURIComponent(workout.path)}`)}
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
          >
            ← Back to {workout.path}
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{workout.title}</h1>
          <p className="text-gray-600">{workout.path}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Workout Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Sets</p>
              <p className="text-xl font-semibold">{workout.sets}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rest Between Sets</p>
              <p className="text-xl font-semibold">{workout.rest_between_sets} min</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rest Between Exercises</p>
              <p className="text-xl font-semibold">{workout.rest_between_exercises} sec</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Warmup</p>
              <p className="text-xl font-semibold">{workout.warmup || 5} min</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercises</h3>
            <div className="space-y-2">
              {workout.workout.map((exercise, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="text-sm text-gray-600">
                    Max reps: {exercise['1s_max']} | Time per rep: {exercise.seconds_per_rep}s
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(`/workout/${workoutId}/play`)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Start
          </button>
          <button
            onClick={() => navigate(`/workout/${workoutId}/calibrate`)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Calibrate
          </button>
          <button
            onClick={() => navigate(`/workout/${workoutId}/configure`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPreview;

