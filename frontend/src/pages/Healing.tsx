import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { BookIcon, MessageSquareIcon, HeadphonesIcon, VideoIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Healing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('journal');

  const [journal, setJournal] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleMoodCheckIn = async (mood: string) => {
    try {
      await api.post('/healing/mood/checkin/', { mood });
    } catch (err) {
      console.error(err);
    }
  };

  const handleJournalSubmit = async () => {
    try {
      await api.post('/healing/journal/entry/', {
        content: journal,
        anonymous,
      });
      alert('Journal saved!');
      setJournal('');
      setAnonymous(false);
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      fetchPosts();
    } catch (err) {
      console.error(err);
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
    { id: 'journal', label: 'Journal', icon: <BookIcon size={18} /> },
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
              {activeTab === 'journal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-montserrat font-medium text-gray-800">Your Safe Space to Express</h3>
                  <p className="text-gray-600">
                    Write your thoughts, feelings, and experiences. Your journal is private unless you choose to share anonymously.
                  </p>
                  <textarea
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="What's on your mind today?"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                        className="mr-2"
                      />
                      Share anonymously with the community
                    </label>
                    <Button onClick={handleJournalSubmit}>Save Journal Entry</Button>
                  </div>
                </div>
              )}

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

            {activeTab === 'audio' && <div className="space-y-6">
                <h3 className="text-lg font-montserrat font-medium text-gray-800">
                  Audio Healing Resources
                </h3>
                <p className="text-gray-600">
                  Listen to guided meditations, calming music, and therapeutic
                  exercises.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <HeadphonesIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">
                          Guided Breathing Exercise
                        </h4>
                        <p className="text-sm text-gray-500">5 minutes</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{
                      width: '30%'
                    }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1:30</span>
                        <span>5:00</span>
                      </div>
                    </div>
                    <button className="mt-2 w-full py-2 bg-primary text-white rounded-lg">
                      Play
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <HeadphonesIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">Healing from Trauma</h4>
                        <p className="text-sm text-gray-500">15 minutes</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{
                      width: '0%'
                    }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0:00</span>
                        <span>15:00</span>
                      </div>
                    </div>
                    <button className="mt-2 w-full py-2 bg-primary text-white rounded-lg">
                      Play
                    </button>
                  </div>
                </div>
              </div>}
            {activeTab === 'video' && <div className="space-y-6">
                <h3 className="text-lg font-montserrat font-medium text-gray-800">
                  Video Healing Resources
                </h3>
                <p className="text-gray-600">
                  Watch therapeutic videos, skill-building workshops, and
                  inspirational stories.
                </p>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative pb-[56.25%] bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <VideoIcon className="h-16 w-16 text-gray-400" />
                      </div>
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
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative pb-[56.25%] bg-gray-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <VideoIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium">
                        Stories of Hope: From Displacement to Empowerment
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        15 minutes • Community Stories
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Listen to inspiring stories from women who have
                        overcome similar challenges.
                      </p>
                      <button className="mt-4 w-full py-2 bg-primary text-white rounded-lg">
                        Watch Video
                      </button>
                    </div>
                  </div>
                </div>
              </div>}

            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default Healing;
