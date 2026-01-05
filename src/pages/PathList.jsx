import { useNavigate } from 'react-router-dom';
import { getPaths } from '../utils/data';

function PathList() {
  const navigate = useNavigate();
  const paths = getPaths();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">MadReps</h1>
          <button
            onClick={() => navigate('/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
          >
            Create New Workout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map(({ path, count }) => (
            <div
              key={path}
              onClick={() => navigate(`/path/${encodeURIComponent(path)}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6 border-2 border-transparent hover:border-indigo-500"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{path}</h2>
              <p className="text-gray-600">{count} workout{count !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>

        {paths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No workout paths found. Create your first workout!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PathList;

