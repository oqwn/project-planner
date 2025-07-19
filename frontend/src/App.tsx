import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Tasks } from './components/Tasks/Tasks';
import { UserList } from './components/UserList';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/timesheets" element={<TimesheetsPlaceholder />} />
          <Route path="/collaboration" element={<CollaborationPlaceholder />} />
          <Route path="/reports" element={<ReportsPlaceholder />} />
          <Route path="/settings" element={<SettingsPlaceholder />} />
        </Routes>
      </Layout>
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
