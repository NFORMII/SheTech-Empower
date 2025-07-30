import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Navigation } from '../../components/Navigation';
import { DonorSideNavigation } from '../../components/DonorSideNavigation';
import { 
  HeartIcon,
  MessageSquareIcon,
  ShareIcon,
  UserIcon // Added for profile
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

// New interfaces for comments and profiles
interface Comment {
  id: number;
  story: number;
  author: string;
  content: string;
  created_at: string;
}

interface UserProfile {
  id: number;
  username: string;
  bio: string;
  // Add other profile details you might have, e.g., avatar, total donations
}

const DonorStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // New states for interactions
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [storyComments, setStoryComments] = useState<Comment[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

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
  }, [activeCategory]); // Added activeCategory to dependency array

  const handleDonate = async (storyId: number, amount: number) => {
    try {
      await api.post(`/stories/${storyId}/donate/`, { amount });
      // Ideally, you'd fetch only the updated story or update its raised amount in state
      // For simplicity here, we re-fetch all stories for now.
      const response = await api.get(`/stories/?category=${activeCategory}&needs_funding=true`);
      setStories(response.data);
    } catch (err: any) {
      console.error('Failed to process donation:', err);
      // You might want to display an error to the user
    }
  };

  // --- New Interaction Handlers ---

  const handleLike = async (storyId: number) => {
    try {
      await api.post(`/stories/${storyId}/like/`);
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === storyId ? { ...story, likes: (story.likes || 0) + 1 } : story
        )
      );
    } catch (err: any) {
      console.error('Failed to like story:', err);
      // Handle error, e.g., show a toast notification
    }
  };

  const handleOpenCommentModal = async (storyId: number) => {
    setCurrentStoryId(storyId);
    try {
      const response = await api.get(`/stories/${storyId}/comments/`);
      setStoryComments(response.data);
      setShowCommentModal(true);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      // Handle error
    }
  };

  const handlePostComment = async () => {
    if (!currentStoryId || !commentText.trim()) return;

    try {
      const response = await api.post(`/stories/${currentStoryId}/comments/`, {
        content: commentText
      });
      setStoryComments(prevComments => [...prevComments, response.data]);
      setCommentText('');
      // Optionally, update the comment count on the story itself
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === currentStoryId ? { ...story, comments: (story.comments || 0) + 1 } : story
        )
      );
    } catch (err: any) {
      console.error('Failed to post comment:', err);
      // Handle error
    }
  };

  const handleShare = (story: Story) => {
    if (navigator.share) {
      navigator.share({
        title: story.title || 'A Story of Hope',
        text: story.description || story.content.substring(0, 100) + '...',
        url: `${window.location.origin}/stories/${story.id}`, // Example URL
      })
      .then(() => console.log('Successfully shared'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(`You can share this story: ${window.location.origin}/stories/${story.id}`);
      // Or implement a custom share dialog
    }
  };

  const handleViewProfile = async (author: string) => {
    try {
      // Assuming your API has an endpoint to fetch user profiles by username/author
      const response = await api.get(`/profiles/${author}/`); 
      setCurrentProfile(response.data);
      setShowProfileModal(true);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      // Handle error, e.g., "Profile not found"
      alert('Could not load user profile.');
    }
  };

  // --- Render Logic ---
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
                          {!story.anonymous && (
                            <button
                              onClick={() => handleViewProfile(story.author)}
                              className="ml-2 text-primary hover:text-primary-dark"
                              title="View Profile"
                            >
                              <UserIcon size={16} />
                            </button>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{story.created_at}</p>
                      </div>
                    </div>
                    {/* FIXED: Corrected ternary operator logic */}
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      story.category === 'healing'
                        ? 'bg-primary/10 text-primary'
                        : story.category === 'hope'
                        ? 'bg-blue-100 text-blue-800'
                        : story.category === 'growth' // Added missing condition here
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800' // Default for 'business' or other
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
                        src={story.image_url || story.image} // Use image_url if available
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
                      onClick={() => handleDonate(story.id, 10)} // Example donation amount
                      className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Support This Story
                    </button>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-6">
                    <button 
                      onClick={() => handleLike(story.id)}
                      className="flex items-center text-gray-500 hover:text-primary"
                    >
                      <HeartIcon size={18} className="mr-1" />
                      <span className="text-sm">{story.likes || 0}</span>
                    </button>
                    <button 
                      onClick={() => handleOpenCommentModal(story.id)}
                      className="flex items-center text-gray-500 hover:text-primary"
                    >
                      <MessageSquareIcon size={18} className="mr-1" />
                      <span className="text-sm">{story.comments || 0}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleShare(story)}
                    className="flex items-center text-gray-500 hover:text-primary"
                  >
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

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <div className="max-h-60 overflow-y-auto mb-4">
              {storyComments.length === 0 ? (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              ) : (
                storyComments.map(comment => (
                  <div key={comment.id} className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="font-medium text-gray-800">{comment.author}</p>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{comment.created_at}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex mb-4">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handlePostComment}
                className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark"
              >
                Post
              </button>
            </div>
            <button
              onClick={() => setShowCommentModal(false)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && currentProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Profile: {currentProfile.username}</h2>
            <div className="mb-4">
              <p className="text-gray-700">
                <strong>Bio:</strong> {currentProfile.bio || 'No bio available.'}
              </p>
              {/* Add more profile details here */}
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorStories;