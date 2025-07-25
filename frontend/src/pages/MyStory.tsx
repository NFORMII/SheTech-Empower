import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import {
  PlusIcon,
  ImageIcon,
  HeartIcon,
  MessageSquareIcon,
  ShareIcon,
  TagIcon
} from 'lucide-react';

const MyStory: React.FC = () => {
  const [stories, setStories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');


  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch stories from backend
  const fetchStories = async () => {
    try {
      const response = await api.get(
        `stories/?category=${activeCategory}`
      );
      // setStories(response.data);
      setStories(Array.isArray(response.data) ? response.data : []);

    } catch (error) {
      console.error('Failed to fetch stories:', error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [activeCategory]);

  const handleSubmitStory = async () => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('category', selectedCategory);
    formData.append('anonymous', String(isAnonymous));
    if (imageFile) formData.append('image', imageFile);

    try {
      await api.post('stories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setContent('');
      setSelectedCategory('');
      setIsAnonymous(false);
      setImageFile(null);
      fetchStories();
    } catch (err) {
      console.error('Error submitting story:', err);
    }
  };

  const categories = [
    { id: 'all', label: 'All Stories' },
    { id: 'healing', label: 'Healing' },
    { id: 'hope', label: 'Hope' },
    { id: 'growth', label: 'Growth' },
    { id: 'business', label: 'Business Idea' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">
              My Story Wall
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Share your story */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
              Share Your Story
            </h2>
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="What would you like to share today? Your story might inspire someone else..."
              ></textarea>


              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="imageUpload"
                  />

                  <label htmlFor="imageUpload" className="flex items-center text-gray-500 hover:text-primary cursor-pointer">
                    <ImageIcon size={18} className="mr-1" />
                    <span className="text-sm">Add Photo</span>
                  </label>


                  <div className="flex items-center">
                    <TagIcon size={18} className="text-gray-500 mr-1" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-sm border-none bg-transparent focus:ring-0 text-gray-500"
                    >
                      <option value="">Select Category</option>
                      <option value="healing">Healing</option>
                      <option value="hope">Hope</option>
                      <option value="growth">Growth</option>
                      <option value="business">Business Idea</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mr-2"
                    />
                    Post anonymously
                  </label>
                  <Button onClick={handleSubmitStory}>
                    <PlusIcon size={16} className="mr-2" />
                    Share Story
                  </Button>
                </div>
              </div>
            </div>
          </div>

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

          {/* Stories */}
          <div className="space-y-6">
            {stories.map((story: any) => (
              <div
                key={story.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {story.anonymous ? 'A' : story.author.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">
                          {story.anonymous ? 'Anonymous' : story.author}
                        </p>
                        <p className="text-xs text-gray-500">{story.date}</p>
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
                      {story.category.charAt(0).toUpperCase() +
                        story.category.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-700">{story.content}</p>
                  {story.image && (
                    <div className="mt-4">
                      <img
                        src={story.image}
                        alt="Story"
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                  )}
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

export default MyStory;
