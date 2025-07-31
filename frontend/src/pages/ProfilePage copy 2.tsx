import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { SideNavigation } from '../components/Navigation';
import {
  UsersIcon,
  BadgeCheckIcon,
  StarIcon,
  UserIcon,
  PencilIcon,
  SaveIcon,
  XIcon,
  MapPinIcon,
  CakeIcon,
  HeartIcon,
  LinkIcon,
  InfoIcon,
  UploadCloudIcon,
  HomeIcon,
  HandHelpingIcon,
  BookOpenIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  TargetIcon,
  PhoneIcon,
  MailIcon,
} from 'lucide-react';
import { Button } from '../components/Button'; // Assuming you have a Button component

interface Profile {
  full_name: string;
  email: string;
  role: 'youth' | 'mentor' | 'donor' | 'idp';
  image?: string;
  rating?: number;
  available?: boolean;
  expertise?: string[];
  age?: number;
  city_of_origin?: string;
  status?: string;
  bio?: string;
  interests?: string[];
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    facebook?: string;
  };
  displacement_date?: string;
  reason_for_displacement?: string;
  current_location?: string;
  immediate_needs?: string[];
  skills?: string[];
  aspirations?: string;
  family_members_count?: number;
  seeking_help?: boolean;

  my_story?: string;
  specific_needs_goals?: string[];
  achievements_strengths?: string[];
  sponsorship_impact?: string;
  preferred_contact_method?: string;
  is_verified?: boolean;

  contact_phone?: string;
  alternative_email?: string;

  mentor?: {
    full_name: string;
    email: string;
    image?: string;
  };
}

interface JournalEntry {
  id: number;
  content: string;
  anonymous: boolean;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  // Journal state
  const [journalEntryContent, setJournalEntryContent] = useState('');
  const [journalEntryAnonymous, setJournalEntryAnonymous] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [fetchingJournal, setFetchingJournal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileAndJournal = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accounts/profile/');
      console.log("RES " + JSON.stringify(res))
      const fetchedProfile: Profile = res.data;
      setProfile(fetchedProfile);
      setFormData({
        full_name: fetchedProfile.full_name || '',
        available: fetchedProfile.available || false,
        expertise: fetchedProfile.expertise || [],
        age: fetchedProfile.age || undefined,
        city_of_origin: fetchedProfile.city_of_origin || '',
        status: fetchedProfile.status || '',
        bio: fetchedProfile.bio || '',
        interests: fetchedProfile.interests || [],
        social_links: fetchedProfile.social_links || {},
        displacement_date: fetchedProfile.displacement_date || '',
        reason_for_displacement: fetchedProfile.reason_for_displacement || '',
        current_location: fetchedProfile.current_location || '',
        immediate_needs: fetchedProfile.immediate_needs || [],
        skills: fetchedProfile.skills || [],
        aspirations: fetchedProfile.aspirations || '',
        family_members_count: fetchedProfile.family_members_count || undefined,
        seeking_help: fetchedProfile.seeking_help || false,
        my_story: fetchedProfile.my_story || '',
        specific_needs_goals: fetchedProfile.specific_needs_goals || [],
        achievements_strengths: fetchedProfile.achievements_strengths || [],
        sponsorship_impact: fetchedProfile.sponsorship_impact || '',
        preferred_contact_method: fetchedProfile.preferred_contact_method || '',
        contact_phone: fetchedProfile.contact_phone || '',
        alternative_email: fetchedProfile.alternative_email || '',
      });

      // Fetch journal entries
      setFetchingJournal(true);
      const journalRes = await api.get('/healing/journal/entry/'); // Assuming this endpoint exists for all entries
      setJournalEntries(journalRes.data);

    } catch (err) {
      console.error('Failed to load profile or journal:', err);
      setError('Failed to load profile or journal entries. Please try again.');
    } finally {
      setLoading(false);
      setFetchingJournal(false);
    }
  };

  useEffect(() => {
    fetchProfileAndJournal();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
        setFormData({ ...formData, [name]: value === '' ? undefined : Number(value) });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    fieldName: keyof Profile
  ) => {
    const lines = e.target.value
      .split(',')
      .map((line) => line.trim())
      .filter(Boolean);
    setFormData({ ...formData, [fieldName]: lines });
  };

  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    platform: keyof Profile['social_links']
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      social_links: {
        ...prevData.social_links,
        [platform]: e.target.value,
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => prev ? { ...prev, image: event.target?.result as string } : prev);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const cleanedSocialLinks = Object.fromEntries(
        Object.entries(formData.social_links || {}).filter(
          ([_, value]) => value !== ''
        )
      );

      const dataToSave = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (['expertise', 'interests', 'immediate_needs', 'skills', 'specific_needs_goals', 'achievements_strengths'].includes(key)) {
            dataToSave.append(key, JSON.stringify(value));
        } else if (key === 'social_links') {
            dataToSave.append(key, JSON.stringify(cleanedSocialLinks));
        }
        else if (value !== undefined && value !== null) {
          dataToSave.append(key, String(value));
        }
      });

      if (profileImageFile) {
        dataToSave.append('image', profileImageFile);
      }

      const res = await api.patch('/accounts/profile/', dataToSave, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(res.data);
      setEditMode(false);
      setProfileImageFile(null);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.detail || 'Could not save changes. Please check your input and try again.');
    } finally {
      setSaving(false);
    }
  };

  // Journal handlers
  const handleJournalSubmit = async () => {
    try {
      setError('');
      const res = await api.post('/healing/journal/entry/', {
        content: journalEntryContent,
        anonymous: journalEntryAnonymous,
      });
      // Add the new entry to the existing list
      setJournalEntries((prevEntries) => [...prevEntries, res.data]);
      setJournalEntryContent('');
      setJournalEntryAnonymous(false);
      alert('Journal entry saved!');
    } catch (err: any) {
      console.error('Failed to save journal entry:', err);
      setError(err.response?.data?.detail || 'Could not save journal entry. Please try again.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl font-medium text-gray-700 animate-pulse">Loading profile...</div>
      </div>
    );
  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl font-medium text-red-600">Profile not found.</div>
      </div>
    );

  const {
    full_name,
    email,
    role,
    image,
    rating,
    available,
    expertise = [],
    age,
    city_of_origin,
    status,
    bio,
    interests = [],
    social_links = {},
    displacement_date,
    reason_for_displacement,
    current_location,
    immediate_needs = [],
    skills = [],
    aspirations,
    family_members_count,
    seeking_help,
    my_story,
    specific_needs_goals = [],
    achievements_strengths = [],
    sponsorship_impact,
    preferred_contact_method,
    is_verified,
    contact_phone,
    alternative_email,
  } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <SideNavigation />
      <div className="flex-grow md:ml-64 p-4 lg:p-8">
        <header className="bg-white shadow-lg rounded-xl mb-8 border border-blue-100">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <h1 className="text-3xl font-playfair-display font-bold text-gray-900">
              Your Profile
            </h1>
            {editMode ? (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  disabled={saving}
                >
                  <SaveIcon className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setProfileImageFile(null);
                    // Reset formData to current profile data on cancel
                    setFormData({
                      full_name: profile.full_name || '',
                      available: profile.available || false,
                      expertise: profile.expertise || [],
                      age: profile.age || undefined,
                      city_of_origin: profile.city_of_origin || '',
                      status: profile.status || '',
                      bio: profile.bio || '',
                      interests: profile.interests || [],
                      social_links: profile.social_links || {},
                      displacement_date: profile.displacement_date || '',
                      reason_for_displacement: profile.reason_for_displacement || '',
                      current_location: profile.current_location || '',
                      immediate_needs: profile.immediate_needs || [],
                      skills: profile.skills || [],
                      aspirations: profile.aspirations || '',
                      family_members_count: profile.family_members_count || undefined,
                      seeking_help: profile.seeking_help || false,
                      my_story: profile.my_story || '',
                      specific_needs_goals: profile.specific_needs_goals || [],
                      achievements_strengths: profile.achievements_strengths || [],
                      sponsorship_impact: profile.sponsorship_impact || '',
                      preferred_contact_method: profile.preferred_contact_method || '',
                      contact_phone: profile.contact_phone || '',
                      alternative_email: profile.alternative_email || '',
                    });
                    setError('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-xl flex items-center gap-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <XIcon className="w-5 h-5" /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                <PencilIcon className="w-5 h-5" /> Edit Profile
              </button>
            )}
          </div>
        </header>

        <main className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-blue-100 transform transition-all duration-500 hover:shadow-2xl">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative mb-6 font-medium" role="alert">
                <strong className="font-bold">Oops!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex-shrink-0 relative">
                <img
                  src={image || '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-300 shadow-lg ring-4 ring-blue-100"
                />
                {editMode && (
                  <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition duration-200">
                    <UploadCloudIcon className="w-6 h-6 text-white" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2 gap-3">
                    {editMode ? (
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="text-4xl font-bold text-gray-900 border-b-2 border-blue-400 focus:border-blue-600 outline-none w-full px-2 py-1 bg-transparent transition duration-200"
                            placeholder="Full Name"
                        />
                    ) : (
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">{full_name}</h2>
                    )}
                    {is_verified && (
                        <span className="text-green-600 ml-2" title="Profile Verified">
                            <CheckCircleIcon className="w-8 h-8" />
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-xl font-medium mb-3">{email}</p>
                <span className={`inline-block px-5 py-1.5 text-base rounded-full font-semibold ${
                    role === 'mentor' ? 'bg-purple-100 text-purple-800' :
                    role === 'donor' ? 'bg-green-100 text-green-800' :
                    role === 'idp' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  } uppercase tracking-wide shadow-sm`}>
                  {role}
                </span>

                {/* My Story Section */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MessageSquareIcon className="w-6 h-6 text-indigo-500" /> My Story
                  </h3>
                  {editMode ? (
                    <textarea
                      name="my_story"
                      value={formData.my_story}
                      onChange={handleChange}
                      rows={7}
                      className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm"
                      placeholder="Share your personal journey, the challenges you've faced due to displacement, and your hopes for the future. Your story helps others understand and connect with you."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed italic text-lg whitespace-pre-wrap">
                      {my_story || 'No story provided yet. Sharing your journey can help connect you with potential sponsors.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Details */}
              <div className="bg-gray-50 p-7 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-gray-600" /> Personal Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <CakeIcon className="w-5 h-5 text-pink-500" />
                    <p className="font-medium w-32">Age:</p>
                    {editMode ? (
                      <input
                        type="number"
                        name="age"
                        value={formData.age === undefined ? '' : formData.age}
                        onChange={handleChange}
                        className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                        placeholder="e.g., 25"
                      />
                    ) : (
                      <p className="text-lg">{age || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MapPinIcon className="w-5 h-5 text-red-500" />
                    <p className="font-medium w-32">City of Origin:</p>
                    {editMode ? (
                      <input
                        type="text"
                        name="city_of_origin"
                        value={formData.city_of_origin}
                        onChange={handleChange}
                        className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                        placeholder="e.g., Kigali"
                      />
                    ) : (
                      <p className="text-lg">{city_of_origin || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <BadgeCheckIcon className="w-5 h-5 text-blue-500" />
                    <p className="font-medium w-32">Status:</p>
                    {editMode ? (
                      <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                        placeholder="e.g., Active, Student"
                      />
                    ) : (
                      <p className="text-lg">{status || 'N/A'}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <HeartIcon className="w-5 h-5 text-red-400" />
                    <p className="font-medium w-32">Interests:</p>
                    {editMode ? (
                      <textarea
                        name="interests"
                        value={formData.interests?.join(', ') || ''}
                        onChange={(e) => handleArrayChange(e, 'interests')}
                        rows={2}
                        className="flex-grow border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="e.g., Reading, Hiking (comma-separated)"
                      />
                    ) : (
                      <ul className="list-disc pl-5 text-gray-600 text-lg space-y-1">
                        {interests.length > 0 ? (
                          interests.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))
                        ) : (
                          <li>No interests listed.</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Role-Specific Details (Professional for Mentor/Donor - Not shown for Youth) */}
              {(role === 'mentor' || role === 'donor') && (
                <div className="bg-gray-50 p-7 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <StarIcon className="w-6 h-6 text-yellow-600" /> Professional Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <StarIcon className="w-5 h-5 text-yellow-500" />
                      <p className="font-medium">Rating: <span className="text-lg">{rating?.toFixed(1) || 'N/A'}</span></p>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <BadgeCheckIcon className="w-5 h-5 text-green-500" />
                      {editMode ? (
                        <label className="flex items-center gap-2 cursor-pointer text-lg">
                          <input
                            type="checkbox"
                            name="available"
                            checked={formData.available}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-green-600 rounded"
                          />
                          <span>Available for Sessions</span>
                        </label>
                      ) : (
                        <p className="text-lg">Available: <span className="font-medium">{available ? 'Yes' : 'No'}</span></p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-blue-500" /> Expertise:
                      </p>
                      {editMode ? (
                        <textarea
                          name="expertise"
                          value={formData.expertise?.join(', ') || ''}
                          onChange={(e) => handleArrayChange(e, 'expertise')}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="e.g., Trauma support, Community development (comma-separated)"
                        />
                      ) : (
                        <ul className="list-disc pl-5 text-gray-600 text-lg space-y-1">
                          {expertise.length > 0 ? (
                            expertise.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))
                          ) : (
                            <li>No expertise listed.</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Displacement & Needs (Only for IDP - Not shown for Youth) */}
              {role === 'idp' && (
                <div className="bg-orange-50 p-7 rounded-2xl shadow-md border border-orange-100">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <HomeIcon className="w-6 h-6 text-orange-600" /> Displacement & Needs
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <CakeIcon className="w-5 h-5 text-orange-500" />
                      <p className="font-medium w-40">Displacement Date:</p>
                      {editMode ? (
                        <input
                          type="date"
                          name="displacement_date"
                          value={formData.displacement_date}
                          onChange={handleChange}
                          className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                        />
                      ) : (
                        <p className="text-lg">{displacement_date || 'N/A'}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <InfoIcon className="w-5 h-5 text-orange-500" />
                      <p className="font-medium w-40">Reason for Displacement:</p>
                      {editMode ? (
                        <input
                          type="text"
                          name="reason_for_displacement"
                          value={formData.reason_for_displacement}
                          onChange={handleChange}
                          className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                          placeholder="e.g., Conflict, Natural disaster"
                        />
                      ) : (
                        <p className="text-lg">{reason_for_displacement || 'N/A'}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <MapPinIcon className="w-5 h-5 text-orange-500" />
                      <p className="font-medium w-40">Current Location:</p>
                      {editMode ? (
                        <input
                          type="text"
                          name="current_location"
                          value={formData.current_location}
                          onChange={handleChange}
                          className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                          placeholder="e.g., Camp XYZ, Kigali"
                        />
                      ) : (
                        <p className="text-lg">{current_location || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <HandHelpingIcon className="w-5 h-5 text-orange-500" /> Immediate Needs:
                      </p>
                      {editMode ? (
                        <textarea
                          name="immediate_needs"
                          value={formData.immediate_needs?.join(', ') || ''}
                          onChange={(e) => handleArrayChange(e, 'immediate_needs')}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="e.g., Food, Shelter, Medical assistance (comma-separated)"
                        />
                      ) : (
                        <ul className="list-disc pl-5 text-gray-600 text-lg space-y-1">
                          {immediate_needs.length > 0 ? (
                            immediate_needs.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))
                          ) : (
                            <li>No specific needs listed.</li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <UsersIcon className="w-5 h-5 text-orange-500" />
                      <p className="font-medium w-40">Family Members:</p>
                      {editMode ? (
                        <input
                          type="number"
                          name="family_members_count"
                          value={formData.family_members_count === undefined ? '' : formData.family_members_count}
                          onChange={handleChange}
                          className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                          placeholder="e.g., 4"
                        />
                      ) : (
                        <p className="text-lg">{family_members_count !== undefined ? family_members_count : 'N/A'}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <HandHelpingIcon className="w-5 h-5 text-orange-500" />
                      {editMode ? (
                        <label className="flex items-center gap-2 cursor-pointer text-lg">
                          <input
                            type="checkbox"
                            name="seeking_help"
                            checked={formData.seeking_help}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-orange-600 rounded"
                          />
                          <span>Actively Seeking Help</span>
                        </label>
                      ) : (
                        <p className="text-lg">Seeking Help: <span className="font-medium">{seeking_help ? 'Yes' : 'No'}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Aspirations  */}
              {(role === 'idp' || role === 'youth' || role === 'mentor') && (
                <div className="bg-gray-50 p-7 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6 text-purple-600" /> Skills & Aspirations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-purple-500" /> Skills:
                      </p>
                      {editMode ? (
                        <textarea
                          name="skills"
                          value={formData.skills?.join(', ') || ''}
                          onChange={(e) => handleArrayChange(e, 'skills')}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="e.g., Carpentry, Teaching, Farming (comma-separated)"
                        />
                      ) : (
                        <ul className="list-disc pl-5 text-gray-600 text-lg space-y-1">
                          {skills.length > 0 ? (
                            skills.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))
                          ) : (
                            <li>No skills listed.</li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <StarIcon className="w-5 h-5 text-purple-500" /> Aspirations:
                      </p>
                      {editMode ? (
                        <textarea
                          name="aspirations"
                          value={formData.aspirations}
                          onChange={handleChange}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="What are your hopes and dreams for the future?"
                        />
                      ) : (
                        <p className="text-gray-700 text-lg leading-relaxed italic">
                          {aspirations || 'No aspirations listed yet.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Needs & Goals section */}
              {role === 'idp' && (
                <div className="bg-teal-50 p-7 rounded-2xl shadow-md border border-teal-100">
                  <h3 className="text-xl font-semibold text-teal-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <TargetIcon className="w-6 h-6 text-teal-600" /> My Goals & Specific Needs
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 font-semibold mb-2">Detailed Needs & Goals:</p>
                      {editMode ? (
                        <textarea
                          name="specific_needs_goals"
                          value={formData.specific_needs_goals?.join(', ') || ''}
                          onChange={(e) => handleArrayChange(e, 'specific_needs_goals')}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="e.g., School fees for one child ($200/term), Small capital for tailoring machine ($150), Medical supplies for diabetes ($50/month) (comma-separated)"
                        />
                      ) : (
                        <ul className="list-disc pl-5 text-gray-700 text-lg space-y-1">
                          {specific_needs_goals.length > 0 ? (
                            specific_needs_goals.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))
                          ) : (
                            <li>No specific needs or goals listed yet.</li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold mb-2">How Sponsorship Helps:</p>
                      {editMode ? (
                        <textarea
                          name="sponsorship_impact"
                          value={formData.sponsorship_impact}
                          onChange={handleChange}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Explain briefly how a sponsor's contribution will directly impact your life or help achieve your goals."
                        />
                      ) : (
                        <p className="text-gray-700 text-lg leading-relaxed italic">
                          {sponsorship_impact || 'No statement on sponsorship impact yet. Clearly stating how help will be used can attract sponsors.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

               {/* Achievements & Strength*/}
               {(role === 'idp' || role === 'youth') && (
                <div className="bg-purple-50 p-7 rounded-2xl shadow-md border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4 border-b pb-3 flex items-center gap-2">
                    <BadgeCheckIcon className="w-6 h-6 text-purple-600" /> Achievements & Strengths
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 font-semibold mb-2">My Achievements & Strengths:</p>
                      {editMode ? (
                        <textarea
                          name="achievements_strengths"
                          value={formData.achievements_strengths?.join(', ') || ''}
                          onChange={(e) => handleArrayChange(e, 'achievements_strengths')}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="e.g., Completed primary school, Good at problem-solving, Resilient leader, Quick learner (comma-separated)"
                        />
                      ) : (
                        <ul className="list-disc pl-5 text-gray-700 text-lg space-y-1">
                          {achievements_strengths.length > 0 ? (
                            achievements_strengths.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))
                          ) : (
                            <li>No achievements or strengths listed yet.</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Links & Preferred Contact Method (now including phone/alt email) */}
              <div className="bg-gray-50 p-7 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 flex items-center gap-2">
                  <LinkIcon className="w-6 h-6 text-teal-500" /> Contact & Social Links
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MessageSquareIcon className="w-5 h-5 text-blue-500" />
                    <p className="font-medium w-48">Preferred Contact Method:</p>
                    {editMode ? (
                      <select
                        name="preferred_contact_method"
                        value={formData.preferred_contact_method}
                        onChange={handleChange}
                        className="flex-grow border border-gray-300 rounded-md p-3 text-base focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      >
                        <option value="">Select Method</option>
                        <option value="Email">Email (Default)</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="SMS">SMS</option>
                      </select>
                    ) : (
                      <p className="text-lg">{preferred_contact_method || 'N/A'}</p>
                    )}
                  </div>

                  {/* NEW: Contact Phone */}
                  <div className="flex items-center space-x-3 text-gray-700">
                    <PhoneIcon className="w-5 h-5 text-green-500" />
                    <p className="font-medium w-48">Contact Phone:</p>
                    {editMode ? (
                      <input
                        type="text"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                        placeholder="e.g., +250 788 123 456"
                      />
                    ) : (
                      <p className="text-lg">{contact_phone || 'N/A'}</p>
                    )}
                  </div>

                  {/* NEW: Alternative Email */}
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MailIcon className="w-5 h-5 text-yellow-500" />
                    <p className="font-medium w-48">Alternative Email:</p>
                    {editMode ? (
                      <input
                        type="email"
                        name="alternative_email"
                        value={formData.alternative_email}
                        onChange={handleChange}
                        className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                        placeholder="e.g., secondary@example.com"
                      />
                    ) : (
                      <p className="text-lg">{alternative_email || 'N/A'}</p>
                    )}
                  </div>

                  {/* Existing Social Links */}
                  {['linkedin', 'github', 'twitter', 'facebook'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-3 text-gray-700">
                      <span className="capitalize w-24 font-medium">{platform}:</span>
                      {editMode ? (
                        <input
                          type="url"
                          name={platform}
                          value={formData.social_links?.[platform as keyof Profile['social_links']] || ''}
                          onChange={(e) => handleSocialLinkChange(e, platform as keyof Profile['social_links'])}
                          className="flex-grow border-b border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-base bg-transparent"
                          placeholder={`Your ${platform} URL`}
                        />
                      ) : (
                        social_links[platform as keyof Profile['social_links']] ? (
                          <a
                            href={social_links[platform as keyof Profile['social_links']]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all text-lg"
                          >
                            {social_links[platform as keyof Profile['social_links']].replace(/^(https?:\/\/)?(www\.)?/, '')}
                          </a>
                        ) : (
                          <p className="text-gray-500 italic text-lg">Not provided</p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned Mentor (Youth Specific) */}
            {role === 'youth' && profile?.mentor && (
              <div className="mt-10 bg-blue-50 p-7 rounded-2xl shadow-inner border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <UserIcon className="w-7 h-7 text-blue-600" /> Your Assigned Mentor
                </h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.mentor.image || '/default-avatar.png'}
                    alt="Mentor"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 shadow-sm"
                  />
                  <div>
                    <p className="text-gray-800 font-semibold text-xl">{profile.mentor.full_name}</p>
                    <p className="text-gray-600 text-base">{profile.mentor.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* My Journal Entries Section */}
            <div className="mt-10 bg-purple-50 p-7 rounded-2xl shadow-md border border-purple-100">
              <h3 className="text-xl font-semibold text-purple-800 mb-4 border-b pb-3 flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6 text-purple-600" /> My Journal
              </h3>
              <p className="text-gray-600 mb-4">
                Your private space to reflect and record your thoughts.
              </p>

              <div className="space-y-6 mb-8">
                <h4 className="text-lg font-montserrat font-medium text-gray-800">New Journal Entry</h4>
                <textarea
                  value={journalEntryContent}
                  onChange={(e) => setJournalEntryContent(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="What's on your mind today? Write your entry here..."
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={journalEntryAnonymous}
                      onChange={(e) => setJournalEntryAnonymous(e.target.checked)}
                      className="mr-2"
                    />
                    Share anonymously with the community (This will also appear in the Support tab)
                  </label>
                  <Button onClick={handleJournalSubmit} disabled={!journalEntryContent.trim()}>
                    Save Journal Entry
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-montserrat font-medium text-gray-800 mb-4">Past Entries</h4>
                {fetchingJournal ? (
                  <p className="text-gray-600">Loading your journal entries...</p>
                ) : journalEntries.length === 0 ? (
                  <p className="text-gray-600 italic">No journal entries yet. Start writing above!</p>
                ) : (
                  <div className="space-y-4">
                    {journalEntries
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by newest first
                      .map((entry) => (
                      <div key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                          <span>
                            {new Date(entry.timestamp).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {entry.anonymous && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              Anonymous (Shared)
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;