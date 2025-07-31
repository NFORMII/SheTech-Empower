// src/pages/MicrograntReviewsPage.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';

interface MicrograntApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  projectName: string;
  requestedAmount: number;
  purpose: string; // Description of how the grant will be used
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  documentsLink?: string; // Link to supporting documents
}

export const MicrograntReviewsPage: React.FC = () => {
  const [applications, setApplications] = useState<MicrograntApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockApplications: MicrograntApplication[] = [
          {
            id: 'mg1',
            applicantName: 'Sophia Rodriguez',
            applicantEmail: 'sophia.r@example.com',
            projectName: 'Community Garden Initiative',
            requestedAmount: 500,
            purpose: 'To purchase seeds, tools, and a water collection system for a community garden in a low-income area.',
            status: 'pending',
            submittedDate: '2025-07-25',
            documentsLink: 'https://docs.google.com/document/d/123xyz',
          },
          {
            id: 'mg2',
            applicantName: 'Liam Carter',
            applicantEmail: 'liam.c@example.com',
            projectName: 'Youth Robotics Workshop',
            requestedAmount: 750,
            purpose: 'To acquire robotics kits and electronic components for a free workshop aimed at introducing underserved youth to STEM.',
            status: 'pending',
            submittedDate: '2025-07-23',
          },
          {
            id: 'mg3',
            applicantName: 'Olivia Perez',
            applicantEmail: 'olivia.p@example.com',
            projectName: 'Local Art Exhibition',
            requestedAmount: 300,
            purpose: 'For venue rental and materials to host a local art exhibition showcasing emerging artists.',
            status: 'approved',
            submittedDate: '2025-07-18',
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

  const handleApproveGrant = async (appId: string) => {
    if (window.confirm('Are you sure you want to approve this microgrant application?')) {
      console.log(`Approving microgrant: ${appId}`);
      // In a real app, send API request
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: 'approved' } : app))
      );
      alert('Microgrant approved! (Simulated)');
      // Trigger notification/email
    }
  };

  const handleRejectGrant = async (appId: string) => {
    const reason = prompt('Please provide a reason for rejecting this application:');
    if (reason !== null) { // User didn't click cancel
      console.log(`Rejecting microgrant: ${appId} with reason: ${reason}`);
      // In a real app, send API request with reason
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: 'rejected' } : app))
      );
      alert('Microgrant rejected! (Simulated)');
      // Trigger notification/email with reason
    }
  };

  const handleViewDocuments = (link?: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('No supporting documents provided for this application.');
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading microgrant applications...
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Microgrant Reviews</h1>
      <p className="text-gray-600 mb-8">Review microgrant applications submitted by mentees or community members.</p>

      {pendingApplications.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Applications ({pendingApplications.length})</h2>
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0 md:mr-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{app.projectName}</h3>
                  <p className="text-gray-600 text-sm">{app.applicantName} ({app.applicantEmail})</p>
                  <p className="text-gray-700 mt-2 line-clamp-2" title={app.purpose}>Purpose: {app.purpose}</p>
                  <p className="text-gray-800 font-bold mt-2">Requested: ${app.requestedAmount.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mt-1">Submitted: {new Date(app.submittedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  {app.documentsLink && (
                    <button
                      onClick={() => handleViewDocuments(app.documentsLink)}
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="View Documents"
                    >
                      <FileText size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleApproveGrant(app.id)}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    title="Approve Grant"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button
                    onClick={() => handleRejectGrant(app.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Reject Grant"
                  >
                    <XCircle size={20} />
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
                  <h3 className="text-lg font-semibold text-gray-900">{app.projectName}</h3>
                  <p className="text-gray-600 text-sm">{app.applicantName} ({app.applicantEmail})</p>
                  <p className="text-gray-700 mt-2 line-clamp-2">Purpose: {app.purpose}</p>
                  <p className="text-gray-800 font-bold mt-2">Requested: ${app.requestedAmount.toLocaleString()}</p>
                  <p className={`mt-2 text-sm font-semibold ${
                    app.status === 'approved' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {app.documentsLink && (
                    <button
                      onClick={() => handleViewDocuments(app.documentsLink)}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="View Documents"
                    >
                      <FileText size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingApplications.length === 0 && reviewedApplications.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          <p className="text-lg">No microgrant applications to review at this time.</p>
        </div>
      )}

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Create a detailed view for each application with all submitted data.</li>
          <li>Implement a robust commenting/discussion system for review committee members.</li>
          <li>Add filtering and sorting options (by amount, date, status).</li>
          <li>Integrate with a payment system if grants are disbursed directly.</li>
          <li>Allow mentors to submit their own proposals for microgrant funding for mentees.</li>
        </ul>
      </div>
    </div>
  );
};