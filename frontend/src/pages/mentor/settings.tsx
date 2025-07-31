// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Bell, Star } from 'lucide-react';

interface MentorProfile {
  name: string;
  email: string;
  phone?: string;
  bio: string;
  expertiseAreas: string[];
  mentoringPreferences: {
    maxMentees: number;
    preferredTopics: string[];
    availability: string; // e.g., "Weekends, Evenings"
  };
  notificationSettings: {
    newApplication: boolean;
    sessionReminder: boolean;
    newMessage: boolean;
  };
}

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MentorProfile | null>(null);

  // Simulate fetching data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockProfile: MentorProfile = {
          name: 'Dr. Evelyn Reed',
          email: 'evelyn.reed@example.com',
          phone: '+1-555-123-4567',
          bio: 'Experienced software engineer with a passion for guiding aspiring tech professionals. Specializes in full-stack development and career transition strategies.',
          expertiseAreas: ['Software Development', 'Career Coaching', 'Project Management'],
          mentoringPreferences: {
            maxMentees: 5,
            preferredTopics: ['Career Growth', 'Technical Skills', 'Networking'],
            availability: 'Weekends, Monday/Wednesday Evenings',
          },
          notificationSettings: {
            newApplication: true,
            sessionReminder: true,
            newMessage: false,
          },
        };
        setProfile(mockProfile);
        setFormData(mockProfile); // Initialize form data with fetched profile
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...(prev as MentorProfile),
        [parent]: {
          ...(prev as any)[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else if (name === 'expertiseAreas' || name === 'mentoringPreferences.preferredTopics') {
      setFormData(prev => ({
        ...(prev as MentorProfile),
        [name]: value.split(',').map(s => s.trim()).filter(Boolean),
      }));
    } else {
      setFormData(prev => ({
        ...(prev as MentorProfile),
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // In a real app, send updated data to API
      // const response = await fetch('/api/mentor/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Failed to update profile');
      // const updatedProfile = await response.json();
      setProfile(formData); // Update displayed profile
      setIsEditing(false);
      alert('Profile updated successfully! (Simulated)');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) { // Only show loading if initial fetch is happening
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading settings...
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

  if (!profile || !formData) return null; // Should not happen if loading is handled

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <p className="text-gray-600 mb-8">Manage your mentor profile and preferences.</p>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mentor Profile</h2>

        {!isEditing ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <p className="mt-1 text-gray-900 font-bold text-lg">{profile.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <p className="mt-1 text-gray-900 flex items-center"><Mail size={16} className="mr-2 text-gray-500" />{profile.email}</p>
            </div>
            {profile.phone && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone:</label>
                <p className="mt-1 text-gray-900 flex items-center"><Phone size={16} className="mr-2 text-gray-500" />{profile.phone}</p>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Bio:</label>
              <p className="mt-1 text-gray-900 whitespace-pre-line">{profile.bio}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Expertise Areas:</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.expertiseAreas.map((area, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Mentoring Preferences</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Max Mentees:</label>
              <p className="mt-1 text-gray-900">{profile.mentoringPreferences.maxMentees}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Preferred Topics:</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {profile.mentoringPreferences.preferredTopics.map((topic, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Availability:</label>
              <p className="mt-1 text-gray-900">{profile.mentoringPreferences.availability}</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Bell size={20} className="mr-2 text-gray-500" />
                <span className="text-gray-900">New Mentorship Application: </span>
                <span className={`ml-2 font-medium ${profile.notificationSettings.newApplication ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.notificationSettings.newApplication ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-gray-500" />
                <span className="text-gray-900">Session Reminders: </span>
                <span className={`ml-2 font-medium ${profile.notificationSettings.sessionReminder ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.notificationSettings.sessionReminder ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center">
                <MessageSquare size={20} className="mr-2 text-gray-500" />
                <span className="text-gray-900">New Message Alerts: </span>
                <span className={`ml-2 font-medium ${profile.notificationSettings.newMessage ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.notificationSettings.newMessage ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Edit size={20} className="mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Profile Information */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                disabled // Email usually not editable directly here
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              ></textarea>
              <p className="mt-2 text-sm text-gray-500">A brief description of your background and mentoring style.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="expertiseAreas" className="block text-sm font-medium text-gray-700">Expertise Areas (comma-separated)</label>
              <input
                type="text"
                name="expertiseAreas"
                id="expertiseAreas"
                value={formData.expertiseAreas.join(', ')}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., Software Development, Career Coaching"
              />
              <p className="mt-2 text-sm text-gray-500">List skills or industries you can mentor in, separated by commas.</p>
            </div>

            {/* Mentoring Preferences */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Mentoring Preferences</h3>
            <div className="mb-6">
              <label htmlFor="maxMentees" className="block text-sm font-medium text-gray-700">Maximum Mentees</label>
              <input
                type="number"
                name="mentoringPreferences.maxMentees"
                id="maxMentees"
                value={formData.mentoringPreferences.maxMentees}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="preferredTopics" className="block text-sm font-medium text-gray-700">Preferred Mentoring Topics (comma-separated)</label>
              <input
                type="text"
                name="mentoringPreferences.preferredTopics"
                id="preferredTopics"
                value={formData.mentoringPreferences.preferredTopics.join(', ')}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., Career Growth, Technical Skills"
              />
              <p className="mt-2 text-sm text-gray-500">Topics you're most interested in mentoring on.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
              <input
                type="text"
                name="mentoringPreferences.availability"
                id="availability"
                value={formData.mentoringPreferences.availability}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., Weekends, Evenings"
              />
              <p className="mt-2 text-sm text-gray-500">Describe your general availability for sessions.</p>
            </div>

            {/* Notification Settings */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Notification Settings</h3>
            <div className="space-y-4">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newApplication"
                    name="notificationSettings.newApplication"
                    type="checkbox"
                    checked={formData.notificationSettings.newApplication}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newApplication" className="font-medium text-gray-700">New Mentorship Application</label>
                  <p className="text-gray-500">Get notified when a new mentee applies.</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sessionReminder"
                    name="notificationSettings.sessionReminder"
                    type="checkbox"
                    checked={formData.notificationSettings.sessionReminder}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sessionReminder" className="font-medium text-gray-700">Session Reminders</label>
                  <p className="text-gray-500">Receive reminders for upcoming mentoring sessions.</p>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newMessage"
                    name="notificationSettings.newMessage"
                    type="checkbox"
                    checked={formData.notificationSettings.newMessage}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newMessage" className="font-medium text-gray-700">New Message Alerts</label>
                  <p className="text-gray-500">Get notified when you receive a new message from a mentee.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(profile); // Revert changes
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Reset/Security (as a separate section for clarity) */}
      <div className="bg-white p-8 rounded-lg shadow-sm mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Lock size={24} className="mr-3 text-gray-600" /> Account Security
        </h2>
        <p className="text-gray-700 mb-4">Manage your password and other security settings.</p>
        <button
          onClick={() => alert('Simulating Password Change: A password change form/modal would appear.')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Change Password
        </button>
      </div>


      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Implement avatar upload functionality for the mentor profile.</li>
          <li>Integrate with a real authentication system for password changes (securely!).</li>
          <li>Add "Delete Account" functionality (with strong confirmation).</li>
          <li>Allow mentors to set their public profile visibility.</li>
          <li>Connect "availability" to a more interactive calendar/scheduling tool.</li>
          <li>Timezone settings.</li>
        </ul>
      </div>
    </div>
  );
};

// Import these if not already in your file
import { Calendar, MessageSquare } from 'lucide-react';