import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserList } from './components/UserList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h1>Project Planner</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Home: React.FC = () => (
  <div>
    <h2>Welcome to Project Planner</h2>
    <p>
      A comprehensive project management application built with React and Spring
      Boot.
    </p>
    <ul>
      <li>✅ React 19.2.0-canary with TypeScript</li>
      <li>✅ Spring Boot 3.4.5 with Java 21</li>
      <li>✅ PostgreSQL database with MyBatis</li>
      <li>✅ React Router v6 for navigation</li>
      <li>✅ Zustand for state management</li>
      <li>✅ Axios for API communication</li>
      <li>✅ OpenAPI/Swagger documentation</li>
    </ul>
  </div>
);

export default App;
