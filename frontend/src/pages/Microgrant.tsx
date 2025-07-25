import React, { useState } from 'react';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import Apply from '../components/microgrants/Apply';
import ApplicationStatus from '../components/microgrants/ApplicationStatus';
import SuccessStory from '../components/microgrants/SuccessStory';

const Microgrant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('apply');

  const tabs = [
    { id: 'apply', label: 'Apply' },
    { id: 'status', label: 'Application Status' },
    { id: 'stories', label: 'Success Stories' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">
              Microgrant Portal
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            {/* Tabs */}
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'apply' && <Apply />}
              {activeTab === 'status' && <ApplicationStatus />}
              {activeTab === 'stories' && <SuccessStory />}
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default Microgrant;
