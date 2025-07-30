import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { MessageSquareIcon, HeadphonesIcon, VideoIcon } from 'lucide-react'; // BookIcon removed as journal moved
import { formatDistanceToNow } from 'date-fns';

const Healing: React.FC = () => {
  // 'journal' tab is removed, default to 'support' or first available tab
  const [activeTab, setActiveTab] = useState<string>('support');

  const handleMoodCheckIn = async (mood: string) => {
    try {
      await api.post('/healing/mood/checkin/', { mood });
      // Optional: Add a small confirmation or UI feedback
      alert(`Mood checked in as: ${mood}`);
    } catch (err) {
      console.error('Mood check-in failed:', err);
      alert('Failed to check in mood. Please try again.');
    }
  };

  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postAnon, setPostAnon] = useState(true);
  const [category, setCategory] = useState('healing');

  const fetchPosts = async () => {
    try {
      const res = await api.get('/healing/support/posts/');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    try {
      await api.post('/healing/support/posts/', {
        content: postContent,
        anonymous: postAnon,
        category,
      });
      setPostContent('');
      setPostAnon(true);
      fetchPosts(); // Refresh posts after submitting
      alert('Post submitted successfully!');
    } catch (err) {
      console.error('Failed to submit post:', err);
      alert('Failed to submit post. Please try again.');
    }
  };

  const moods = [
    { emoji: '😢', label: 'Sad' },
    { emoji: '😕', label: 'Worried' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😄', label: 'Happy' },
    { emoji: '😌', label: 'Peaceful' },
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '😰', label: 'Anxious' },
  ];

  const tabs = [
    { id: 'support', label: 'Support', icon: <MessageSquareIcon size={18} /> },
    { id: 'audio', label: 'Audio', icon: <HeadphonesIcon size={18} /> },
    { id: 'video', label: 'Video', icon: <VideoIcon size={18} /> },
  ];

  const categoryColors: Record<string, string> = {
    healing: 'bg-primary/10 text-primary',
    growth: 'bg-blue-500/10 text-blue-500',
    trauma: 'bg-red-500/10 text-red-500',
    tips: 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Healing Center</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Mood check-in */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">How are you feeling right now?</h2>
            <div className="grid grid-cols-4 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleMoodCheckIn(mood.label)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'support' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-montserrat font-medium text-gray-800">Peer Support Forum</h3>
                  <p className="text-gray-600">Connect with others who understand what you're going through.</p>
                  <div className="space-y-4">
                    {posts.map((post: any) => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{post.anonymous ? 'Anonymous' : 'User'}</p>
                            <p className="text-xs text-gray-500">
                              Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              categoryColors[post.category] || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                        </div>
                        <p className="mt-3 text-gray-700">{post.content}</p>
                        <div className="mt-4 flex gap-2">
                          <Button variant="secondary" size="sm">Send Support</Button>
                          <Button variant="outline" size="sm">Reply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t mt-6">
                    <h4 className="text-md font-medium text-gray-800 mb-2">Share your thoughts</h4>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={postAnon}
                          onChange={(e) => setPostAnon(e.target.checked)}
                          className="mr-2"
                        />
                        Post anonymously
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-300 text-sm rounded px-2 py-1"
                      >
                        <option value="healing">Healing</option>
                        <option value="growth">Growth</option>
                        <option value="trauma">Trauma</option>
                        <option value="tips">Tips</option>
                      </select>
                      <Button onClick={handlePostSubmit}>Post</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-montserrat font-medium text-gray-800">
                    Audio Healing Resources
                  </h3>
                  <p className="text-gray-600">
                    Listen to guided meditations, calming music, and therapeutic
                    exercises.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Guided Breathing Exercise Audio */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <HeadphonesIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">
                            Guided Breathing Exercise
                          </h4>
                          <p className="text-sm text-gray-500">Approximately 5 minutes</p>
                        </div>
                      </div>
                      {/* Audio embed */}
                      <audio controls src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" className="w-full"></audio>
                      <p className="text-xs text-gray-500 mt-2">Source: soundhelix.com (royalty-free music for demonstration)</p>
                    </div>

                    {/* Healing from Trauma Audio */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <HeadphonesIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">Healing from Trauma Meditation</h4>
                          <p className="text-sm text-gray-500">Approximately 15 minutes</p>
                        </div>
                      </div>
                      {/* Audio embed */}
                      <audio controls src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" className="w-full"></audio>
                      <p className="text-xs text-gray-500 mt-2">Source: soundhelix.com (royalty-free music for demonstration)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'video' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-montserrat font-medium text-gray-800">
                    Video Healing Resources
                  </h3>
                  <p className="text-gray-600">
                    Watch therapeutic videos, skill-building workshops, and
                    inspirational stories.
                  </p>
                  <div className="grid grid-cols-1 gap-6">
                    {/* First Video Embed (from previous instruction) */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative pb-[56.25%] bg-gray-100">
                        <iframe
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/1ep4iC3vRyA?si=a3eqtb6cc6nbFNXG"
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="absolute top-0 left-0"
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium">
                          Understanding Trauma & Building Resilience
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          20 minutes • Dr. Maya Johnson
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Learn about how trauma affects the brain and practical
                          techniques to build resilience.
                        </p>
                        <button className="mt-4 w-full py-2 bg-primary text-white rounded-lg">
                          Watch Video
                        </button>
                      </div>
                    </div>

                    {/* Second Video Embed (Anti-Depression Comedy - VALID PLACEHOLDER) */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative pb-[56.25%] bg-gray-100">
                        {/*
                          IMPORTANT: Replace this 'src' with the actual YouTube embed URL
                          of your chosen anti-depression comedy video.
                          Example: "https://www.youtube.com/embed/dQw4w9WgXcQ" (a well-known, harmless public video for testing)
                          Or find a specific comedy sketch/stand-up suitable for uplifting mood.
                        */}
                        <iframe
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/funny_mood_boost_example" // REPLACE THIS with your chosen video's actual embed URL
                          title="Anti-Depression Comedy Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          className="absolute top-0 left-0"
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium">
                          Boost Your Mood: Anti-Depression Comedy
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Enjoy a dose of laughter and lighten your mood.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          A curated selection of uplifting and funny clips to help you feel better.
                        </p>
                        <button className="mt-4 w-full py-2 bg-primary text-white rounded-lg">
                          Watch Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default Healing;