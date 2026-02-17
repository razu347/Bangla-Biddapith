
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Student } from './types';
import { MOCK_STUDENTS } from './services/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin onLogin={setCurrentUser} />} />
        <Route 
          path="/student/dashboard" 
          element={currentUser ? <StudentDashboard student={currentUser} /> : <Navigate to="/student/login" />} 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
        <Route 
          path="/admin/dashboard" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
