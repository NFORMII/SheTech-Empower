// src/pages/PeopleStoriesPage.tsx
import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface Story {
  id: string;
  menteeName: string;
  title: string;
  storyContent: string;
  date: string; // YYYY-MM-DD
  menteeAvatar?: string;
}

export const PeopleStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockStories: Story[] = [
          {
            id: 'story1',
            menteeName: 'Grace Hopper',
            title: 'Found My Dream Job!',
            storyContent: 'My mentor helped me refine my resume, prepare for interviews, and build confidence. Thanks to their guidance, I landed my dream job as a software engineer at a leading tech company!',
            date: '2025-07-10',
            // menteeAvatar: 'https://via.placeholder.com/40/8A2BE2/FFFFFF?text=GH',
          },
          {
            id: 'story2',
            menteeName: 'Alan Turing',
            title: 'Successfully Launched My Startup',
            storyContent: 'The entrepreneurial mentorship program was invaluable. My mentor provided critical insights into market analysis, funding strategies, and legal aspects, enabling me to launch my startup successfully.',
            date: '2025-06-25',
            // menteeAvatar: 'https://via.placeholder.com/40/008080/FFFFFF?text=AT',
          },
          {
            id: 'story3',
            menteeName: 'Ada Lovelace',
            title: 'Improved My Leadership Skills',
            storyContent: 'Through regular sessions and practical exercises, my mentor helped me develop crucial leadership qualities. I now feel much more confident leading my team and managing complex projects.',
            date: '2025-07-01',
            // menteeAvatar: 'https://via.placeholder.com/40/FF4500/FFFFFF?text=AL',
          },
        ];
        setStories(mockStories);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading stories...
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">People Stories</h1>
      <p className="text-gray-600 mb-8">Inspiring success stories from your mentees and others in the program.</p>

      {stories.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          <p className="text-lg">No success stories to display yet.</p>
          <p className="mt-2">Encourage your mentees to share their journey!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
              <div className="flex items-center mb-4">
                {story.menteeAvatar ? (
                  <img src={story.menteeAvatar} alt={story.menteeName} className="w-10 h-10 rounded-full mr-3 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-600 text-sm font-semibold">
                    {story.menteeName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{story.menteeName}</h3>
                  <p className="text-sm text-gray-500">{new Date(story.date).toLocaleDateString()}</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-primary mb-3">{story.title}</h4>
              <div className="flex-grow">
                <blockquote className="text-gray-700 italic border-l-4 border-primary pl-4 py-2">
                  <p className="relative">
                    <Quote className="absolute -top-2 -left-7 text-gray-300 transform -scale-x-100" size={30} />
                    {story.storyContent}
                    <Quote className="absolute -bottom-2 -right-7 text-gray-300" size={30} />
                  </p>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Allow mentees (or mentors on behalf of mentees) to submit new stories via a form.</li>
          <li>Implement a "featured stories" section or carousel.</li>
          <li>Add categories/tags for stories (e.g., "Career Change," "Startup Success").</li>
          <li>Allow comments or reactions on stories.</li>
          <li>Integrate with social media sharing functionalities.</li>
        </ul>
      </div>
    </div>
  );
};