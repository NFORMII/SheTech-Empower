import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { MentorSideNavigation } from '../../components/MentorSideNavigation';

interface Application {
  id: number;
  applicant: {
    name: string;
    email: string;
    location: string;
  };
  reason: string;
  goals: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const MentorApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/mentor/applications/');
        setApplications(response.data);
      } catch (err: any) {
        console.error('Failed to load applications:', err);
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApplicationUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/mentor/applications/${id}/`, { status });
      // Refresh the applications list
      const response = await api.get('/mentor/applications/');
      setApplications(response.data);
    } catch (err: any) {
      console.error('Failed to update application:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MentorSideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Mentorship Applications</h1>
            <p className="text-gray-600 mt-1">Review and respond to mentorship applications</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {applications.map((application) => (
              <div 
                key={application.id} 
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.applicant.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.applicant.location} • {application.applicant.email}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Reason for Seeking Mentorship</h4>
                      <p className="mt-1 text-sm text-gray-600">{application.reason}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Goals</h4>
                      <p className="mt-1 text-sm text-gray-600">{application.goals}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Experience</h4>
                      <p className="mt-1 text-sm text-gray-600">{application.experience}</p>
                    </div>
                  </div>

                  {application.status === 'pending' && (
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleApplicationUpdate(application.id, 'approved')}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApplicationUpdate(application.id, 'rejected')}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default MentorApplications;
