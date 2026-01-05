import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadWorkouts, saveWorkout } from '../utils/data';

function Configure() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const workouts = loadWorkouts();
  const workout = workouts.find(w => w._id === workoutId);

  const [formData, setFormData] = useState({
    warmup: workout?.warmup || 5,
    sets: workout?.sets || 1,
    rest_between_sets: workout?.rest_between_sets || 1,
    rest_between_exercises: workout?.rest_between_exercises || 10,
    shuffle: workout?.shuffle !== undefined ? workout.shuffle : true,
    workout: workout?.workout || [],
  });

  useEffect(() => {
    if (workout) {
      setFormData({
        warmup: workout.warmup || 5,
        sets: workout.sets || 1,
        rest_between_sets: workout.rest_between_sets || 1,
        rest_between_exercises: workout.rest_between_exercises || 10,
        shuffle: workout.shuffle !== undefined ? workout.shuffle : true,
        workout: workout.workout || [],
      });
    }
  }, [workout]);

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

  const handleSave = () => {
    const updatedWorkout = {
      ...workout,
      ...formData,
    };
    saveWorkout(updatedWorkout);
    navigate(`/workout/${workoutId}`);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...formData.workout];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, workout: updated });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      workout: [
        ...formData.workout,
        { name: '', '1s_max': 10, seconds_per_rep: 2, upper: 0.2, lower: 0.2 },
      ],
    });
  };

  const removeExercise = (index) => {
    setFormData({
      ...formData,
      workout: formData.workout.filter((_, i) => i !== index),
    });
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
          <h1 className="text-4xl font-bold text-gray-800">Configure Workout</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warmup Time (minutes)
              </label>
              <input
                type="number"
                value={formData.warmup}
                onChange={(e) => setFormData({ ...formData, warmup: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Sets
              </label>
              <input
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rest Between Sets (minutes)
              </label>
              <input
                type="number"
                value={formData.rest_between_sets}
                onChange={(e) => setFormData({ ...formData, rest_between_sets: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rest Between Exercises (seconds)
              </label>
              <input
                type="number"
                value={formData.rest_between_exercises}
                onChange={(e) => setFormData({ ...formData, rest_between_exercises: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="shuffle"
                checked={formData.shuffle}
                onChange={(e) => setFormData({ ...formData, shuffle: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="shuffle" className="ml-2 text-sm font-medium text-gray-700">
                Shuffle exercises between sets
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Exercises</h2>
            <button
              onClick={addExercise}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Add Exercise
            </button>
          </div>

          <div className="space-y-4">
            {formData.workout.map((exercise, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">Exercise {index + 1}</h3>
                  <button
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Reps (1s_max)</label>
                    <input
                      type="number"
                      value={exercise['1s_max']}
                      onChange={(e) => updateExercise(index, '1s_max', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seconds per Rep</label>
                    <input
                      type="number"
                      value={exercise.seconds_per_rep}
                      onChange={(e) => updateExercise(index, 'seconds_per_rep', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => navigate(`/workout/${workoutId}`)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Configure;

