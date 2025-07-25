import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation } from '../components/Navigation';
import { DonorSideNavigation } from '../components/DonorSideNavigation';
import { SmileIcon, BookOpenIcon, UsersIcon, GiftIcon, BellIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DonorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [mood, setMood] = useState<string | null>(dashboardData?.mood?.label || null);

//   const moods = [
//     { label: 'Sad', emoji: '😢' },
//     { label: 'Worried', emoji: '😕' },
//     { label: 'Neutral', emoji: '😐' },
//     { label: 'Okay', emoji: '🙂' },
//     { label: 'Happy', emoji: '😄' },
//     { label: 'Peaceful', emoji: '😌' },
//     { label: 'Frustrated', emoji: '😤' },
//     { label: 'Anxious', emoji: '😰' },
//   ];


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/');
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      }
    };
    fetchDashboard();
  }, []);

  const handleMoodSelect = async (label: string) => {
    try {
      setMood(label);
      await api.post('/healing/mood/checkin/', { mood: label });
    } catch (err) {
      console.error('Failed to submit mood:', err);
    }
  };


  if (!dashboardData) {
    return <div className="text-center py-10">Loading...</div>;
  }

 return (
  <div className="min-h-screen bg-gray-50 flex">
    <DonorSideNavigation />
    <div className="flex-grow pb-20 md:pb-0 md:ml-64">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-montserrat font-bold text-gray-900">Welcome, {dashboardData.name || 'Donor'}!</h1>
          <p className="text-gray-600 mt-1">Here's a summary of your donation impact.</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-medium text-gray-800">Total Donations</h3>
            <p className="text-2xl font-bold text-green-600">${dashboardData.total_donations || 0}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-medium text-gray-800">Stories Funded</h3>
            <p className="text-2xl font-bold text-yellow-600">{dashboardData.stories_funded || 0}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-500">
            <h3 className="text-lg font-medium text-gray-800">Donations This Month</h3>
            <p className="text-2xl font-bold text-indigo-600">${dashboardData.monthly_donations || 0}</p>
          </div>
        </div>

        {/* You can add charts or recent donations list here */}
      </main>
    </div>
    <Navigation />
  </div>
);
};

export default DonorDashboard;