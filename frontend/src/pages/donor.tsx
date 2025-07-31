import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { GiftIcon, SmileIcon } from 'lucide-react';

const DonorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);

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

  if (!dashboardData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-montserrat font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-montserrat font-medium text-gray-800">
            Hi {dashboardData.name || 'Donor'}, thank you for your contributions!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's how you're making an impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <GiftIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Total Donations</h3>
                <p className="text-2xl font-bold text-green-600">${dashboardData.total_donations || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full mr-4">
                <SmileIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Stories Funded</h3>
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.stories_funded || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-full mr-4">
                <GiftIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Donations This Month</h3>
                <p className="text-2xl font-bold text-indigo-600">${dashboardData.monthly_donations || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DonorDashboard;
