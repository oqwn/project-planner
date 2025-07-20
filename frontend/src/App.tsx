import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Tasks } from './components/Tasks/Tasks';
import { UserList } from './components/UserList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import authService from './services/auth';
import { useAuthStore } from './store/authStore';
import './App.css';

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    authService.initializeAuth();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route
                    path="/timesheets"
                    element={<TimesheetsPlaceholder />}
                  />
                  <Route
                    path="/collaboration"
                    element={<CollaborationPlaceholder />}
                  />
                  <Route path="/reports" element={<ReportsPlaceholder />} />
                  <Route path="/settings" element={<SettingsPlaceholder />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Placeholder components for future implementation
const TimesheetsPlaceholder: React.FC = () => (
  <div className="placeholder-page">
    <h1>Timesheets</h1>
    <p>Time tracking interface coming soon...</p>
  </div>
);

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
