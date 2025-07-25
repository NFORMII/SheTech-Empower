import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { DonorSideNavigation } from '../../components/DonorSideNavigation';

interface MicrograntApplication {
  id: number;
  title: string;
  description: string;
  amount_requested: number;
  amount_funded: number;
  category: string;
  status: 'pending' | 'approved' | 'funded' | 'completed';
  applicant: {
    name: string;
    location: string;
  };
  created_at: string;
}

const DonorMicrogrants: React.FC = () => {
  const [applications, setApplications] = useState<MicrograntApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/microgrants/applications/');
        setApplications(response.data);
      } catch (err: any) {
        console.error('Failed to load microgrant applications:', err);
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleFund = async (applicationId: number, amount: number) => {
    try {
      await api.post(`/microgrants/${applicationId}/fund/`, { amount });
      // Refresh applications after funding
      const response = await api.get('/microgrants/applications/');
      setApplications(response.data);
    } catch (err: any) {
      console.error('Failed to process funding:', err);
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
      <DonorSideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Microgrant Applications</h1>
            <p className="text-gray-600 mt-1">Support women through microgrants</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {applications.map((application) => (
              <div 
                key={application.id} 
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{application.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By {application.applicant.name} from {application.applicant.location}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'funded' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
                
                <p className="mt-4 text-gray-600">{application.description}</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Funded: ${application.amount_funded}</span>
                    <span>Requested: ${application.amount_requested}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (application.amount_funded / application.amount_requested) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {application.status !== 'completed' && (
                  <button
                    onClick={() => handleFund(application.id, 50)}
                    className="mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Fund this Application
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default DonorMicrogrants;
