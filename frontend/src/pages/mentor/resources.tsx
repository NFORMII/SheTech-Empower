// src/pages/ResourcesPage.tsx
import React, { useState, useEffect } from 'react';
import { FileText, Link, Download } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'link' | 'video'; // Could be 'pdf', 'article', 'webinar'
  url: string;
}

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockResources: Resource[] = [
          {
            id: 'res1',
            title: 'Effective Mentoring Techniques Guide',
            description: 'A comprehensive guide on best practices for mentors, including communication strategies and goal setting.',
            type: 'document',
            url: '/documents/effective_mentoring_guide.pdf', // Example local path or cloud storage link
          },
          {
            id: 'res2',
            title: 'Building Strong Mentee Relationships',
            description: 'An article focusing on fostering trust and open communication with your mentees.',
            type: 'link',
            url: 'https://example.com/article/strong-relationships',
          },
          {
            id: 'res3',
            title: 'Webinar: Navigating Difficult Mentoring Conversations',
            description: 'A recorded webinar offering strategies for handling challenging situations.',
            type: 'video',
            url: 'https://youtube.com/watch?v=mentor_conversations_webinar',
          },
          {
            id: 'res4',
            title: 'Goal Setting Worksheet for Mentees',
            description: 'A printable worksheet to help your mentees define and track their objectives.',
            type: 'document',
            url: '/documents/goal_setting_worksheet.pdf',
          },
        ];
        setResources(mockResources);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleResourceClick = (url: string, type: string) => {
    if (type === 'document' && url.startsWith('/documents')) {
      // For local documents, might trigger a download or open in new tab
      window.open(url, '_blank');
    } else {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading resources...
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Resources</h1>
      <p className="text-gray-600 mb-8">Access valuable mentoring resources and guides to enhance your mentoring journey.</p>

      {resources.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          <p className="text-lg">No resources available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-3">
                  {resource.type === 'document' && <FileText className="text-primary mr-3" size={24} />}
                  {resource.type === 'link' && <Link className="text-primary mr-3" size={24} />}
                  {resource.type === 'video' && <Download className="text-primary mr-3" size={24} />} {/* Using Download icon for videos/webinars as a placeholder for "view" or "access" */}
                  <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">{resource.description}</p>
              </div>
              <button
                onClick={() => handleResourceClick(resource.url, resource.type)}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {resource.type === 'document' ? 'View Document' : resource.type === 'link' ? 'Visit Link' : 'Watch Webinar'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Implement search and filter functionalities for resources (by type, topic).</li>
          <li>Allow admins/program managers to upload and manage resources.</li>
          <li>Add a "Mark as Read" or "Favorites" feature for mentors.</li>
          <li>Include a feedback mechanism for resources (e.g., ratings, comments).</li>
          <li>Categorize resources into sections like "Getting Started," "Advanced Techniques," etc.</li>
        </ul>
      </div>
    </div>
  );
};