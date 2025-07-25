import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { DonorSideNavigation } from '../../components/DonorSideNavigation';
import { 
  HeartIcon,
  MessageSquareIcon,
  ShareIcon
} from 'lucide-react';

interface Story {
  id: number;
  title?: string;
  content: string;
  description?: string;
  category: string;
  anonymous: boolean;
  image?: string;
  image_url?: string;
  created_at: string;
  author: string;
  likes?: number;
  comments?: number;
  amount_needed?: number;
  amount_raised?: number;
}

const DonorStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'healing', label: 'Healing' },
    { id: 'hope', label: 'Hope' },
    { id: 'growth', label: 'Growth' },
    { id: 'business', label: 'Business Idea' }
  ];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/stories/?category=${activeCategory}&needs_funding=true`);
        setStories(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        console.error('Failed to load stories:', err);
        setError(err.response?.data?.message || 'Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDonate = async (storyId: number, amount: number) => {
    try {
      await api.post(`/stories/${storyId}/donate/`, { amount });
      // Refresh stories after donation
      const response = await api.get('/stories/available/');
      setStories(response.data);
    } catch (err: any) {
      console.error('Failed to process donation:', err);
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
            <h1 className="text-xl font-montserrat font-bold text-gray-900">People Stories</h1>
            <p className="text-gray-600 mt-1">Support individuals by contributing to their stories</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story: Story) => (
              <div key={story.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {story.anonymous ? 'A' : story.author?.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {story.anonymous ? 'Anonymous' : story.author}
                        </p>
                        <p className="text-xs text-gray-500">{story.created_at}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      story.category === 'healing'
                        ? 'bg-primary/10 text-primary'
                        : story.category === 'hope'
                        ? 'bg-blue-100 text-blue-800'
                        : story.category === 'growth'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-700">{story.description || story.content}</p>
                  {story.image && (
                    <div className="mt-4">
                      <img
                        src={story.image}
                        alt="Story"
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Raised: ${story.amount_raised || 0}</span>
                      <span>Goal: ${story.amount_needed || 1000}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, ((story.amount_raised || 0) / (story.amount_needed || 1000)) * 100)}%` 
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleDonate(story.id, 10)}
                      className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Support This Story
                    </button>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-6">
                    <button className="flex items-center text-gray-500 hover:text-primary">
                      <HeartIcon size={18} className="mr-1" />
                      <span className="text-sm">{story.likes || 0}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-primary">
                      <MessageSquareIcon size={18} className="mr-1" />
                      <span className="text-sm">{story.comments || 0}</span>
                    </button>
                  </div>
                  <button className="flex items-center text-gray-500 hover:text-primary">
                    <ShareIcon size={18} className="mr-1" />
                    <span className="text-sm">Share</span>
                  </button>
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

export default DonorStories;
