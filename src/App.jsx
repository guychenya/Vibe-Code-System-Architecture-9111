import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import AuthCallback from './components/auth/AuthCallback';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CodeVersions from './pages/CodeVersions';
import Chat from './pages/Chat';
import Requirements from './pages/Requirements';
import Settings from './pages/Settings';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Initializing application..." />;
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback/:provider" element={<AuthCallback />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 pt-16">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/versions" element={
                <ProtectedRoute requiredPermission="code_review">
                  <CodeVersions />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/requirements" element={
                <ProtectedRoute>
                  <Requirements />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/auth/callback/:provider" element={<AuthCallback />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;