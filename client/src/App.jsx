import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import the pages we just created
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* ToastContainer allows us to show beautiful popup alerts anywhere in our app */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* If a user goes to the main URL '/', instantly redirect them to the Login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Define our actual routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;