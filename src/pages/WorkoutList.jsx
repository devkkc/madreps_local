import { useParams, useNavigate } from 'react-router-dom';
import { getWorkoutsByPath } from '../utils/data';

function WorkoutList() {
  const { pathName } = useParams();
  const navigate = useNavigate();
  const workouts = getWorkoutsByPath(decodeURIComponent(pathName));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
          >
            ← Back to Paths
          </button>
          <h1 className="text-4xl font-bold text-gray-800">{decodeURIComponent(pathName)}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout._id}
              onClick={() => navigate(`/workout/${workout._id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6 border-2 border-transparent hover:border-indigo-500"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{workout.title}</h2>
              <div className="text-gray-600 space-y-1">
                <p>Sets: {workout.sets}</p>
                <p>Exercises: {workout.workout.length}</p>
                {workout.tags && workout.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {workout.tags.map((tag, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {workouts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No workouts found for this path.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutList;

