import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import { AuthProvider, useAuth } from './context/AuthContext';
import About from './pages/about';
import Contact from './pages/Contact'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <Routes>
          <Route 
            path="/login" 
            element={
              <div className="flex items-center justify-center min-h-screen p-4">
                <Login />
              </div>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <div className="flex items-center justify-center min-h-screen p-4">
                <Signup />
              </div>
            }
          />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="h-screen flex flex-col">
                  <Chat />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;