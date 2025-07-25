import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { MentorSideNavigation } from '../../components/MentorSideNavigation';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface MicrograntApplication {
  id: number;
  mentee_name: string;
  amount_requested: number;
  purpose: string;
  description: string;
  submitted_date: string;
  status: 'pending' | 'approved' | 'rejected';
  additional_notes?: string;
}

const MentorMicrogrants: React.FC = () => {
  const [applications, setApplications] = useState<MicrograntApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/mentor/microgrants/');
        setApplications(response.data);
      } catch (err: any) {
        console.error('Failed to load microgrant applications:', err);
        setError(err.response?.data?.message || 'Failed to load microgrant applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/mentor/microgrants/${id}/${action}/`);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' } : app
      ));
    } catch (err: any) {
      console.error(`Failed to ${action} application:`, err);
      alert(`Failed to ${action} application`);
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
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Microgrant Applications</h1>
            <p className="text-gray-600 mt-1">Review and manage microgrant applications from your mentees</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {applications.map((application) => (
              <div 
                key={application.id} 
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Application from {application.mentee_name}
                      </h3>
                      <div className="mt-2 flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="ml-1 text-lg font-medium text-green-600">
                          ${application.amount_requested}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Purpose</h4>
                    <p className="mt-1 text-sm text-gray-600">{application.purpose}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Description</h4>
                    <p className="mt-1 text-sm text-gray-600">{application.description}</p>
                  </div>

                  {application.additional_notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Additional Notes</h4>
                      <p className="mt-1 text-sm text-gray-600">{application.additional_notes}</p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Submitted on {application.submitted_date}</span>
                    </div>
                    
                    {application.status === 'pending' && (
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleAction(application.id, 'approve')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(application.id, 'reject')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
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

export default MentorMicrogrants;
