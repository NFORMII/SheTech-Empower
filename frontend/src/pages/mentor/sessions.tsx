// src/pages/SessionsPage.tsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Video } from 'lucide-react';

interface Session {
  id: string;
  menteeName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  topic: string;
  link?: string; // e.g., Google Meet link
  status: 'scheduled' | 'completed' | 'canceled';
}

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockSessions: Session[] = [
          {
            id: 'sess1',
            menteeName: 'Alice Johnson',
            date: '2025-08-01',
            time: '10:00 AM',
            topic: 'Career Path Discussion',
            link: 'https://meet.google.com/abc-defg-hij',
            status: 'scheduled',
          },
          {
            id: 'sess2',
            menteeName: 'Bob Williams',
            date: '2025-08-05',
            time: '02:00 PM',
            topic: 'Resume Review',
            status: 'scheduled',
          },
          {
            id: 'sess3',
            menteeName: 'Charlie Brown',
            date: '2025-07-28',
            time: '04:00 PM',
            topic: 'Project Feedback',
            status: 'completed',
          },
        ];
        setSessions(mockSessions);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleAddSession = () => {
    console.log('Open modal/form to add a new session');
    alert('Simulating Add Session: A form or modal would appear here.');
    // navigate('/mentor/sessions/new'); or open a modal
  };

  const handleEditSession = (sessionId: string) => {
    console.log(`Open modal/form to edit session: ${sessionId}`);
    alert(`Simulating Edit Session: A form or modal for session ${sessionId} would appear.`);
    // navigate(`/mentor/sessions/edit/${sessionId}`); or open a modal
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      console.log(`Deleting session: ${sessionId}`);
      // In a real app, send DELETE request
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      alert('Session deleted! (Simulated)');
    }
  };

  const handleJoinSession = (link?: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('No meeting link available for this session.');
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled').sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time.replace(' AM', ':00').replace(' PM', ':00').replace(' PM', ' PM')}`);
    const dateTimeB = new Date(`${b.date}T${b.time.replace(' AM', ':00').replace(' PM', ':00').replace(' PM', ' PM')}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  const pastSessions = sessions.filter(s => s.status === 'completed' || s.status === 'canceled').sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time.replace(' AM', ':00').replace(' PM', ':00').replace(' PM', ' PM')}`);
    const dateTimeB = new Date(`${b.date}T${b.time.replace(' AM', ':00').replace(' PM', ':00').replace(' PM', ' PM')}`);
    return dateTimeB.getTime() - dateTimeA.getTime(); // Sort descending for past sessions
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading sessions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sessions</h1>
      <p className="text-gray-600 mb-8">Manage your mentoring sessions.</p>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddSession}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Session
        </button>
      </div>

      {upcomingSessions.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Sessions ({upcomingSessions.length})</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">Session with {session.menteeName}</h3>
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Date:</span> {new Date(session.date).toLocaleDateString()}
                    <span className="ml-4 font-medium">Time:</span> {session.time}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Topic: {session.topic}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  {session.link && (
                    <button
                      onClick={() => handleJoinSession(session.link)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="Join Session"
                    >
                      <Video size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditSession(session.id)}
                    className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
                    title="Edit Session"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete Session"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past & Canceled Sessions ({pastSessions.length})</h2>
          <div className="space-y-4">
            {pastSessions.map((session) => (
              <div key={session.id} className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center border border-gray-200">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">Session with {session.menteeName}</h3>
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Date:</span> {new Date(session.date).toLocaleDateString()}
                    <span className="ml-4 font-medium">Time:</span> {session.time}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Topic: {session.topic}</p>
                  <p className={`mt-2 text-sm font-semibold ${session.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {/* No actions for past sessions, or potentially a "View Summary" */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingSessions.length === 0 && pastSessions.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          <p className="text-lg">No sessions scheduled or recorded yet.</p>
          <button
            onClick={handleAddSession}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Schedule Your First Session
          </button>
        </div>
      )}

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Integrate with a calendar API (Google Calendar, Outlook) for automatic event creation.</li>
          <li>Implement a robust session scheduling form with date/time pickers.</li>
          <li>Allow mentors to mark sessions as "completed" and add notes/summaries after each session.</li>
          <li>Send automated reminders to both mentor and mentee before sessions.</li>
          <li>Filtering and sorting options for sessions.</li>
          <li>Display a calendar view of sessions.</li>
        </ul>
      </div>
    </div>
  );
};