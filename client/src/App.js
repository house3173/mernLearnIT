import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './components/layout/Landing';
import Auth from './views/Auth';
import AuthContextProvider from './contexts/AuthContext';
import DashBoard from './views/DashBoard';
import About from './views/About'
import ProtectedRoute from './components/routing/ProtectedRoute';
import PostContextProvider from './contexts/PostContext';

function App() {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth authRoute="login" />} />
            <Route path="/register" element={<Auth authRoute="register" />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                    <DashBoard /> 
                </ProtectedRoute>
              }
            />
            <Route
              path='/about'
              element={
                <ProtectedRoute>
                  <About/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default App;
