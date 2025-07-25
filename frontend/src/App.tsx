import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Healing from './pages/Healing';
import Learn from './pages/Learn';
import Mentorship from './pages/Mentorship';
import Microgrant from './pages/Microgrant';
import MyStory from './pages/MyStory';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/donor';
import DonorStories from './pages/donor/stories';
import DonorMicrogrants from './pages/donor/microgrants';
import MentorDashboard from './pages/mentor';
import MentorApplications from './pages/mentor/applications';
import MentorMentees from './pages/mentor/mentees';
import MentorSessions from './pages/mentor/sessions';
import MentorStories from './pages/mentor/stories';
import MentorMicrogrants from './pages/mentor/microgrants';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/healing" element={
              <PrivateRoute>
                <Healing />
              </PrivateRoute>
            } />
            <Route path="/learn" element={
              <PrivateRoute>
                <Learn />
              </PrivateRoute>
            } />
            <Route path="/mentorship" element={
              <PrivateRoute>
                <Mentorship />
              </PrivateRoute>
            } />
            <Route path="/microgrant" element={
              <PrivateRoute>
                <Microgrant />
              </PrivateRoute>
            } />
            <Route path="/my-story" element={
              <PrivateRoute>
                <MyStory />
              </PrivateRoute>
            } />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route
              path="/mentor"
              element={
                <PrivateRoute requiredRole="mentor">
                  <MentorDashboard />
                </PrivateRoute>
              } 
            />
            <Route
              path="/mentor/applications"
              element={
                <PrivateRoute requiredRole="mentor">
                  <MentorApplications />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentor/mentees"
              element={
                <PrivateRoute requiredRole="mentor">
                  <MentorMentees />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentor/sessions"
              element={
                <PrivateRoute requiredRole="mentor">
                  <MentorSessions />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentor/stories"
              element={
                <PrivateRoute requiredRole="mentor">
                  <MentorStories />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentor/microgrants"
              element={
                <PrivateRoute requiredRole="mentor">
                  <MentorMicrogrants />
                </PrivateRoute>
              }
            />
                        <Route path="/donor" element={
              <PrivateRoute>
                <DonorDashboard />
              </PrivateRoute>
            } />
            <Route path="/donor/stories" element={
              <PrivateRoute>
                <DonorStories />
              </PrivateRoute>
            } />
            <Route path="/donor/microgrants" element={
              <PrivateRoute>
                <DonorMicrogrants />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
