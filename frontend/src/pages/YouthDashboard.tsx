import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { SmileIcon, BookOpenIcon, UsersIcon, GiftIcon, BellIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const YouthDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [mood, setMood] = useState<string | null>(null);

  const moods = [
    { label: 'Sad', emoji: '😢' },
    { label: 'Worried', emoji: '😕' },
    { label: 'Neutral', emoji: '😐' },
    { label: 'Okay', emoji: '🙂' },
    { label: 'Happy', emoji: '😄' },
    { label: 'Peaceful', emoji: '😌' },
    { label: 'Frustrated', emoji: '😤' },
    { label: 'Anxious', emoji: '😰' },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/');
        setDashboardData(res.data);
        setMood(res.data?.mood?.label || null);
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

  if (!dashboardData) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-montserrat font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Mood check-in */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-montserrat font-medium text-gray-800">
            Hi {dashboardData.name || 'there'}, how are you feeling today?
          </h2>
          <div className="mt-4">
            <p className="text-gray-600 mb-3">Check in with your mood:</p>
            <div className="flex justify-between items-center">
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => handleMoodSelect(m.label)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    mood === m.label ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick-glance tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Healing Progress */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <SmileIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-montserrat font-medium text-gray-800">Healing Progress</h3>
                <p className="text-gray-500">{dashboardData.journal_entries_this_week} journal entries this week</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${dashboardData.journal_progress_percent}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.journal_progress_percent}% towards your weekly goal
              </p>
            </div>
          </div>

          {/* Courses */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/10 rounded-full mr-4">
                <BookOpenIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-montserrat font-medium text-gray-800">Courses in Progress</h3>
                <p className="text-gray-500">{dashboardData.course_title}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${dashboardData.course_progress_percent}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData.course_progress_percent}% completed
              </p>
            </div>
          </div>

          {/* Mentorship */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/10 rounded-full mr-4">
                <UsersIcon className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-montserrat font-medium text-gray-800">Mentorship</h3>
                <p className="text-gray-500">{dashboardData.mentorship_session_time || "No session scheduled"}</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                View Details
              </button>
            </div>
          </div>

          {/* Microgrant */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-accent">
            <div className="flex items-center">
              <div className="p-2 bg-accent/10 rounded-full mr-4">
                <GiftIcon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-montserrat font-medium text-gray-800">Microgrant Application</h3>
                <p className="text-gray-500">Status: {dashboardData.microgrant_status}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: `${dashboardData.microgrant_progress_percent}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Application {dashboardData.microgrant_progress_percent}% processed
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white shadow rounded-lg p-6 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-montserrat font-medium text-gray-800">Recent Notifications</h3>
              <div className="p-2 bg-gray-100 rounded-full">
                <BellIcon className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="space-y-4">
              {dashboardData?.notifications?.map((n, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(n.timestamp))} ago
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default YouthDashboard;
