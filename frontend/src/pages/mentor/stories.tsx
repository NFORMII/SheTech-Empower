import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { MentorSideNavigation } from '../../components/MentorSideNavigation';
import { Clock, Heart } from 'lucide-react';

interface Story {
  id: number;
  mentee_name: string;
  title: string;
  content: string;
  date_shared: string;
  impact_area: string;
  likes_count: number;
  image?: string;
}

const MentorStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/mentor/stories/');
        setStories(response.data);
      } catch (err: any) {
        console.error('Failed to load stories:', err);
        setError(err.response?.data?.message || 'Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
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
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Mentee Stories</h1>
            <p className="text-gray-600 mt-1">Success stories shared by your mentees</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                {story.image && (
                  <div className="w-full h-48 bg-gray-200">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{story.title}</h3>
                      <p className="text-sm text-gray-500">By {story.mentee_name}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                      {story.impact_area}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-600">{story.content}</p>

                  <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Shared on {story.date_shared}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span>{story.likes_count} likes</span>
                    </div>
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

export default MentorStories;
