import React from 'react';
import MentorDashboard from './mentor';
import DonorDashboard from './donor';
import YouthDashboard from './YouthDashboard';
import { Navigation, SideNavigation } from '../components/Navigation';
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center py-10">Please log in to view your dashboard.</div>;
  }

  const role = user?.role;

  const renderDashboardByRole = () => {
    switch (role) {
      case 'mentor':
        return <MentorDashboard user={user} />;
      case 'donor':
        return <DonorDashboard user={user} />;
      case 'youth':
        return <YouthDashboard user={user} />;
      default:
        return <div className="text-center py-10">Unknown role: {role}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow md:ml-64 pb-20 md:pb-0">
        {renderDashboardByRole()}
      </div>
      <Navigation />
    </div>
  );
};

export default Dashboard;
