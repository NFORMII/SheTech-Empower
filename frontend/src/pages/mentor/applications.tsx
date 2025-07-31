// src/pages/MentorshipApplicationsPage.tsx
import React, { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  applicantEmail: string;
  reason: string; // Why they want a mentor
  skillsSeeking: string[]; // Skills they want to learn
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export const MentorshipApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockApplications: Application[] = [
          {
            id: 'app1',
            applicantName: 'David Lee',
            applicantEmail: 'david.l@example.com',
            reason: 'Looking for guidance in transitioning to a new industry.',
            skillsSeeking: ['Networking', 'Project Management'],
            status: 'pending',
            appliedDate: '2025-07-20',
          },
          {
            id: 'app2',
            applicantName: 'Emily Chen',
            applicantEmail: 'emily.c@example.com',
            reason: 'Need help with interview preparation and career strategy.',
            skillsSeeking: ['Interview Skills', 'Career Planning'],
            status: 'pending',
            appliedDate: '2025-07-22',
          },
          {
            id: 'app3',
            applicantName: 'Frank White',
            applicantEmail: 'frank.w@example.com',
            reason: 'Seeking advice on starting my own small business.',
            skillsSeeking: ['Business Development', 'Marketing'],
            status: 'approved',
            appliedDate: '2025-07-15',
          },
        ];
        setApplications(mockApplications);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (appId: string) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      console.log(`Approving application: ${appId}`);
      // In a real app, send an API request to update status
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: 'approved' } : app))
      );
      alert('Application approved! (Simulated)');
      // Optionally, trigger an email notification to the applicant
    }
  };

  const handleReject = async (appId: string) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      console.log(`Rejecting application: ${appId}`);
      // In a real app, send an API request to update status
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: 'rejected' } : app))
      );
      alert('Application rejected! (Simulated)');
      // Optionally, trigger an email notification to the applicant
    }
  };

  const handleViewDetails = (application: Application) => {
    alert(`
      Applicant: ${application.applicantName}
      Email: ${application.applicantEmail}
      Reason: ${application.reason}
      Skills Seeking: ${application.skillsSeeking.join(', ')}
      Status: ${application.status}
      Applied Date: ${new Date(application.appliedDate).toLocaleDateString()}
    `);
    // In a real app, this would open a modal or navigate to a detail page
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading applications...
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mentorship Applications</h1>
      <p className="text-gray-600 mb-8">Review mentorship applications from prospective mentees.</p>

      {pendingApplications.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Applications ({pendingApplications.length})</h2>
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{app.applicantName}</h3>
                  <p className="text-gray-600 text-sm">{app.applicantEmail}</p>
                  <p className="text-gray-700 mt-2 line-clamp-2" title={app.reason}>{app.reason}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Skills Seeking:</span> {app.skillsSeeking.join(', ')}
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(app)}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    title="Approve"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Reject"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewedApplications.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviewed Applications</h2>
          <div className="space-y-4">
            {reviewedApplications.map((app) => (
              <div key={app.id} className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{app.applicantName}</h3>
                  <p className="text-gray-600 text-sm">{app.applicantEmail}</p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{app.reason}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Status: </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <span className="ml-4 font-medium">Applied: </span>{new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(app)}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="View Details"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingApplications.length === 0 && reviewedApplications.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          <p className="text-lg">No mentorship applications to display at this time.</p>
        </div>
      )}

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Implement a dedicated modal or a separate route for full application details.</li>
          <li>Add filters (e.g., by date, skills, status).</li>
          <li>Provide a free-text feedback/notes field when approving or rejecting.</li>
          <li>Automated matching suggestions based on mentor's profile and mentee's needs.</li>
          <li>Integration with an email service to send automated notifications.</li>
        </ul>
      </div>
    </div>
  );
};