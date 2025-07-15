import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CodeVersions from './pages/CodeVersions';
import Chat from './pages/Chat';
import Requirements from './pages/Requirements';
import Settings from './pages/Settings';
import LoginPage from './components/auth/LoginPage';
import AuthCallback from './components/auth/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback/:provider" element={<AuthCallback />} />

          {/* Protected app routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 pt-16">
                    <Dashboard />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 pt-16">
                    <Projects />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/versions" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 pt-16">
                    <CodeVersions />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 pt-16">
                    <Chat />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/requirements" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 pt-16">
                    <Requirements />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 ml-64 pt-16">
                    <Settings />
                  </main>
                </div>
              </>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;