import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup';
import Login from './Pages/LoginPage';
import ResumeBuilder from './Pages/ResumeBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resume" element={<ResumeBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
