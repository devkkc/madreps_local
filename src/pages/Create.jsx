import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveWorkout } from '../utils/data';

function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    path: '',
    title: '',
    warmup: 5,
    sets: 1,
    rest_between_sets: 1,
    rest_between_exercises: 10,
    shuffle: true,
    workout: [{ name: '', '1s_max': 10, seconds_per_rep: 2, upper: 0.2, lower: 0.2 }],
  });

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

  const handleSave = () => {
    if (!formData.path || !formData.title || formData.workout.length === 0) {
      alert('Please fill in all required fields (path, title, and at least one exercise)');
      return;
    }

    const newWorkout = {
      _id: `new_${Date.now()}`,
      path: formData.path,
      title: formData.title,
      tags: [],
      warmup: formData.warmup,
      sets: formData.sets,
      rest_between_sets: formData.rest_between_sets,
      rest_between_exercises: formData.rest_between_exercises,
      freq_factor: 1,
      shuffle: formData.shuffle,
      workout: formData.workout,
    };

    saveWorkout(newWorkout);
    navigate(`/workout/${newWorkout._id}`);
  };

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
          <h1 className="text-4xl font-bold text-gray-800">Create New Workout</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Path <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Animal Flow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Crawls #1"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  {formData.workout.length > 1 && (
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercise Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Push Ups"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Reps (1s_max) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={exercise['1s_max']}
                      onChange={(e) => updateExercise(index, '1s_max', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seconds per Rep <span className="text-red-500">*</span>
                    </label>
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
            Create Workout
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;

