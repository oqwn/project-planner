import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Tasks } from './components/Tasks/Tasks';
import { TimeTracking } from './components/TimeTracking/TimeTracking';
import { UserList } from './components/UserList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import authService from './services/auth';
import { useAuthStore } from './store/authStore';
import { ProjectProvider } from './contexts/ProjectContext';
import './App.css';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Initialize auth service with token from localStorage
    authService.initializeAuth();

    // Get current user from localStorage and set in store
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []); // Empty dependency array - run only once on mount

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProjectProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/timesheets" element={<TimeTracking />} />
                    <Route
                      path="/collaboration"
                      element={<CollaborationPlaceholder />}
                    />
                    <Route path="/reports" element={<ReportsPlaceholder />} />
                    <Route path="/settings" element={<SettingsPlaceholder />} />
                  </Routes>
                </Layout>
              </ProjectProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Placeholder components for future implementation

const CollaborationPlaceholder: React.FC = () => (
  <div className="placeholder-page">
    <h1>Collaboration</h1>
    <p>Team collaboration tools coming soon...</p>
  </div>
);

const ReportsPlaceholder: React.FC = () => (
  <div className="placeholder-page">
    <h1>Reports</h1>
    <p>Project reporting and analytics coming soon...</p>
  </div>
);

const SettingsPlaceholder: React.FC = () => (
  <div className="placeholder-page">
    <h1>Settings</h1>
    <p>Project settings and configuration coming soon...</p>
  </div>
);

export default App;
