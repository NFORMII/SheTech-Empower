import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { UsersIcon, BadgeCheckIcon, StarIcon, UserIcon } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/accounts/profile/');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!profile) return <div className="text-center py-10">Profile not found.</div>;

  const { full_name, email, role, image, rating, available, expertise = [] } = profile;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Your Profile</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6">
              <img
                src={image || '/default-avatar.png'}
                alt="User"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{full_name}</h2>
                <p className="text-gray-600">{email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full uppercase font-semibold">
                  {role}
                </span>
              </div>
            </div>

            {/* Extra info for mentors & donors */}
            {(role === 'mentor' || role === 'donor') && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <p className="text-gray-700">Rating: {rating?.toFixed(1) || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BadgeCheckIcon className="w-5 h-5 text-green-500" />
                  <p className="text-gray-700">Available: {available ? 'Yes' : 'No'}</p>
                </div>
                {expertise.length > 0 && (
                  <div>
                    <p className="text-gray-700 font-semibold mb-1">Expertise:</p>
                    <ul className="list-disc pl-5 text-gray-600">
                      {expertise.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Extra info for youth */}
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
