import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { MentorSideNavigation } from '../../components/MentorSideNavigation';
import { MessageSquare, Calendar, Clock } from 'lucide-react';

interface Mentee {
  id: number;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  goals: string;
  progress_status: 'early' | 'ongoing' | 'advanced';
  last_session?: string;
  next_session?: string;
}

const MentorMentees: React.FC = () => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true);
        const response = await api.get('/mentor/mentees/');
        setMentees(response.data);
      } catch (err: any) {
        console.error('Failed to load mentees:', err);
        setError(err.response?.data?.message || 'Failed to load mentees');
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

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
            <h1 className="text-xl font-montserrat font-bold text-gray-900">My Mentees</h1>
            <p className="text-gray-600 mt-1">Manage and track your mentees' progress</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {mentees.map((mentee) => (
              <div 
                key={mentee.id} 
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {mentee.avatar ? (
                          <img 
                            src={mentee.avatar} 
                            alt={mentee.name} 
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <span className="text-xl font-medium text-primary">
                            {mentee.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{mentee.name}</h3>
                        <p className="text-sm text-gray-500">{mentee.location}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      mentee.progress_status === 'early' ? 'bg-blue-100 text-blue-800' :
                      mentee.progress_status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {mentee.progress_status.charAt(0).toUpperCase() + mentee.progress_status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Goals</h4>
                    <p className="mt-1 text-sm text-gray-600">{mentee.goals}</p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Last Session: {mentee.last_session || 'None'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Next Session: {mentee.next_session || 'None scheduled'}</span>
                    </div>
                    <button
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </button>
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

export default MentorMentees;
