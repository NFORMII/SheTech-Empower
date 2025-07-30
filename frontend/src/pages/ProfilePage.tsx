import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { UsersIcon, BadgeCheckIcon, StarIcon, UserIcon, PencilIcon, SaveIcon, XIcon } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/accounts/profile/');
        setProfile(res.data);
        setFormData({
          full_name: res.data.full_name || '',
          available: res.data.available || false,
          expertise: res.data.expertise || [],
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split(',').map((line) => line.trim()).filter(Boolean);
    setFormData({ ...formData, expertise: lines });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const res = await api.patch('/accounts/profile/', formData);
      setProfile(res.data);
      setEditMode(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError('Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!profile) return <div className="text-center py-10">Profile not found.</div>;

  const { full_name, email, role, image, rating, available, expertise = [] } = profile;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Your Profile</h1>
            {editMode ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  disabled={saving}
                >
                  <SaveIcon className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded flex items-center gap-1"
                >
                  <XIcon className="w-4 h-4" /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <PencilIcon className="w-4 h-4" /> Edit
              </button>
            )}
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex items-center space-x-6">
              <img
                src={image || '/default-avatar.png'}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                {editMode ? (
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="text-xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold text-gray-800">{full_name}</h2>
                )}
                <p className="text-gray-600">{email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full uppercase font-semibold">
                  {role}
                </span>
              </div>
            </div>

            {(role === 'mentor' || role === 'donor') && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <p className="text-gray-700">Rating: {rating?.toFixed(1) || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeCheckIcon className="w-5 h-5 text-green-500" />
                  {editMode ? (
                    <label className="text-gray-700 flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                      />
                      Available
                    </label>
                  ) : (
                    <p className="text-gray-700">Available: {available ? 'Yes' : 'No'}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-700 font-semibold mb-1">Expertise:</p>
                  {editMode ? (
                    <textarea
                      name="expertise"
                      value={formData.expertise.join(', ')}
                      onChange={handleExpertiseChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      placeholder="e.g., Trauma support, Community development"
                    />
                  ) : (
                    <ul className="list-disc pl-5 text-gray-600">
                      {expertise.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {role === 'youth' && profile?.mentor && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned Mentor</h3>
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-purple-500" />
                  <p className="text-gray-700">{profile.mentor.full_name}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default ProfilePage;