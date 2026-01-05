import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PathList from './pages/PathList';
import WorkoutList from './pages/WorkoutList';
import WorkoutPreview from './pages/WorkoutPreview';
import Configure from './pages/Configure';
import Calibrate from './pages/Calibrate';
import Create from './pages/Create';
import WorkoutPlayer from './pages/WorkoutPlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PathList />} />
        <Route path="/path/:pathName" element={<WorkoutList />} />
        <Route path="/workout/:workoutId" element={<WorkoutPreview />} />
        <Route path="/workout/:workoutId/configure" element={<Configure />} />
        <Route path="/workout/:workoutId/calibrate" element={<Calibrate />} />
        <Route path="/create" element={<Create />} />
        <Route path="/workout/:workoutId/play" element={<WorkoutPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;

