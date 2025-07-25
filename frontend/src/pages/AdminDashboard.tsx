import React, { useState } from 'react';
import { UsersIcon, BookOpenIcon, GiftIcon, BookIcon, FileTextIcon, BarChartIcon, CheckCircleIcon, XCircleIcon, UploadIcon, PlusIcon } from 'lucide-react';
import { Button } from '../components/Button';
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const tabs = [{
    id: 'overview',
    label: 'Overview',
    icon: <BarChartIcon size={20} />
  }, {
    id: 'users',
    label: 'Users',
    icon: <UsersIcon size={20} />
  }, {
    id: 'content',
    label: 'Content',
    icon: <FileTextIcon size={20} />
  }, {
    id: 'grants',
    label: 'Grants',
    icon: <GiftIcon size={20} />
  }, {
    id: 'stories',
    label: 'Stories',
    icon: <BookIcon size={20} />
  }];
  const stats = [{
    name: 'Total Users',
    value: '487',
    change: '+12%',
    trend: 'up'
  }, {
    name: 'Active Courses',
    value: '16',
    change: '+2',
    trend: 'up'
  }, {
    name: 'Pending Grants',
    value: '23',
    change: '-5',
    trend: 'down'
  }, {
    name: 'Content Views',
    value: '2,156',
    change: '+22%',
    trend: 'up'
  }];
  const pendingStories = [{
    id: 1,
    author: 'Grace T.',
    preview: 'With my microgrant, I started a small tailoring business...',
    category: 'Business',
    date: '2 days ago'
  }, {
    id: 2,
    author: 'Anonymous',
    preview: "I've been struggling with nightmares about the conflict...",
    category: 'Healing',
    date: '3 days ago'
  }];
  const pendingGrants = [{
    id: 1,
    name: 'Amina J.',
    business: 'Mobile Hairdressing Service',
    amount: '$450',
    date: 'May 20, 2023'
  }, {
    id: 2,
    name: 'Blessing O.',
    business: 'Digital Design Studio',
    amount: '$500',
    date: 'May 22, 2023'
  }, {
    id: 3,
    name: 'Marie T.',
    business: 'Vegetable Farm Expansion',
    amount: '$350',
    date: 'May 23, 2023'
  }];
  return <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-montserrat font-bold text-primary">
            SheTech Admin
          </h1>
        </div>
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {tabs.map(tab => <li key={tab.id}>
                <button onClick={() => setActiveTab(tab.id)} className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <div className="mr-3">{tab.icon}</div>
                  <span className="font-medium">{tab.label}</span>
                </button>
              </li>)}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <span className="ml-2">Log Out</span>
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-grow">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">
              Admin Dashboard
            </h1>
            {/* Mobile navigation */}
            <div className="md:hidden">
              <select value={activeTab} onChange={e => setActiveTab(e.target.value)} className="border-gray-300 rounded-lg">
                {tabs.map(tab => <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>)}
              </select>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === 'overview' && <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => <div key={stat.name} className="bg-white shadow rounded-lg p-6">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.name}
                    </p>
                    <p className="mt-2 flex items-baseline">
                      <span className="text-3xl font-semibold text-gray-900">
                        {stat.value}
                      </span>
                      <span className={`ml-2 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </p>
                  </div>)}
              </div>
              {/* Quick actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <UploadIcon size={20} className="mr-2 text-primary" />
                    <span>Upload New Content</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <UsersIcon size={20} className="mr-2 text-blue-500" />
                    <span>Manage Users</span>
                  </button>
                  <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <GiftIcon size={20} className="mr-2 text-green-500" />
                    <span>Review Grant Applications</span>
                  </button>
                </div>
              </div>
              {/* Pending approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending stories */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-montserrat font-medium text-gray-800">
                      Pending Stories
                    </h2>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                      {pendingStories.length} pending
                    </span>
                  </div>
                  <div className="space-y-4">
                    {pendingStories.map(story => <div key={story.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{story.author}</p>
                            <p className="text-sm text-gray-500">
                              {story.date}
                            </p>
                          </div>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {story.category}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600 text-sm">
                          {story.preview}
                        </p>
                        <div className="mt-4 flex space-x-2">
                          <button className="p-1 text-green-500 hover:bg-green-50 rounded">
                            <CheckCircleIcon size={20} />
                          </button>
                          <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                            <XCircleIcon size={20} />
                          </button>
                          <button className="flex-grow text-left text-sm text-primary hover:underline">
                            View full story
                          </button>
                        </div>
                      </div>)}
                  </div>
                </div>
                {/* Pending grants */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-montserrat font-medium text-gray-800">
                      Pending Grant Applications
                    </h2>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                      {pendingGrants.length} pending
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Business
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingGrants.map(grant => <tr key={grant.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {grant.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {grant.date}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {grant.business}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {grant.amount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-primary hover:text-primary/80">
                                Review
                              </button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>}
          {activeTab === 'content' && <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-montserrat font-medium text-gray-800">
                  Content Management
                </h2>
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  Add New Content
                </Button>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                      <input type="text" placeholder="Search content..." className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select className="border border-gray-300 rounded-lg">
                        <option>All Types</option>
                        <option>Courses</option>
                        <option>Videos</option>
                        <option>Audio</option>
                      </select>
                      <select className="border border-gray-300 rounded-lg">
                        <option>All Categories</option>
                        <option>Healing</option>
                        <option>Skills</option>
                        <option>Business</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Understanding Trauma & Building Resilience
                          </div>
                          <div className="text-xs text-gray-500">
                            Added May 10, 2023
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Video
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">Healing</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          245
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Coding 101: Introduction to HTML
                          </div>
                          <div className="text-xs text-gray-500">
                            Added May 5, 2023
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Course
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">Skills</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          187
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Guided Breathing Exercise
                          </div>
                          <div className="text-xs text-gray-500">
                            Added Apr 28, 2023
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Audio
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">Healing</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          312
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">3</span> of{' '}
                    <span className="font-medium">12</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-primary text-white">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      2
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>}
          {/* Other tabs would be implemented similarly */}
          {(activeTab === 'users' || activeTab === 'grants' || activeTab === 'stories') && <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-montserrat font-medium text-gray-800 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{' '}
                Management
              </h2>
              <p className="text-gray-600">
                This section allows you to manage {activeTab}. The full
                implementation would include tables, filters, and actions.
              </p>
            </div>}
        </main>
      </div>
    </div>;
};
export default AdminDashboard;