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
import { MentorshipApplicationsPage } from './pages/mentor/applications';
import {MyMenteesPage} from './pages/mentor/mentees';
import {SessionsPage} from './pages/mentor/sessions';
import {PeopleStoriesPage} from './pages/mentor/stories';
import {MicrograntReviewsPage} from './pages/mentor/microgrants';
import {ResourcesPage} from './pages/mentor/resources';
import {MessagesPage} from './pages/mentor/messages';
import {SettingsPage} from './pages/mentor/settings';
import ProfilePage from './pages/ProfilePage';

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
            <PrivateRoute>
            <MentorshipApplicationsPage />
            // </PrivateRoute>
            }
          />

          <Route 
          path="/mentor/mentees"
            element={
            <PrivateRoute>
            <MyMenteesPage/>
            </PrivateRoute>
            } 
            />
            <Route 
            path="/mentor/sessions" 
            element={
            <SessionsPage/>
            }
            />
            <Route
              path="/mentor/stories"
              element={
            <PeopleStoriesPage />
              } 
            />
            <Route 
            path="/mentor/microgrants" 
            element={
            <MicrograntReviewsPage />
            } 
            />
            <Route
            path="/mentor/resources" 
            element={
            <ResourcesPage />
            } 
            />
          <Route 
          path="/mentor/messages" 
            element={
            <MessagesPage />
            } 
            />
          <Route
              path="/mentor/settings" 
              element={
              <SettingsPage />
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
            <Route path="/my-profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
