import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { CalendarIcon, MessageSquareIcon, SearchIcon, FilterIcon, StarIcon, CheckIcon } from 'lucide-react';

interface Mentor {
  id: number;
  // Changed 'name' to 'full_name' to match your JSX usage, or if 'name' is meant to be the full name,
  // then 'full_name' usage in JSX should be changed to 'name'.
  // Assuming full_name is the correct field from your backend response.
  full_name: string;
  role: string;
  expertise: string[];
  image: string; // URL to mentor's profile image
  rating: number;
  available: boolean;
  // Add other fields that might come from the backend for a full profile
  // e.g., bio: string; contact_email: string;
}

const Mentorship: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpertise, setFilterExpertise] = useState<string[]>([]);
  // State to track if a mentor request has been sent to prevent multiple requests
  const [requestedMentors, setRequestedMentors] = useState<Set<number>>(new Set());


  // Fetch all mentors and the user's assigned mentor
  useEffect(() => {
    const fetchMentorsData = async () => {
      try {
        // Fetch all available mentors
        const allMentorsResponse = await api.get<Mentor[]>('/mentors/'); // Assuming this endpoint exists and returns all mentors
        setMentors(allMentorsResponse.data);

        // Fetch the currently assigned mentor for the logged-in user
        const assignedMentorResponse = await api.get<Mentor | null>('/mentor/my/');
        setCurrentMentor(assignedMentorResponse.data);

        // Optionally, fetch any previously sent mentor requests to disable buttons
        const requestsResponse = await api.get<{ mentor_id: number }[]>('/mentor/my_requests/'); // Assuming an endpoint for user's pending requests
        const initialRequested = new Set(requestsResponse.data.map(req => req.mentor_id));
        setRequestedMentors(initialRequested);

      } catch (error) {
        console.error('Failed to load mentorship data:', error);
        // Handle error, maybe set an error state
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsData();
  }, []);

  // Handler for requesting a mentor
  const handleRequestMentor = async (mentorId: number) => {
    if (currentMentor) {
      alert('You already have an assigned mentor. Please unassign your current mentor first if you wish to change.');
      return;
    }
    if (requestedMentors.has(mentorId)) {
        alert('You have already sent a request to this mentor.');
        return;
    }

    try {
      // Make an API call to request this mentor
      // This endpoint would typically create a 'MentorRequest' or similar on the backend
      await api.post('/mentor/request/', { mentor_id: mentorId });
      setRequestedMentors(prev => new Set(prev).add(mentorId)); // Add to set to disable button
      alert('Mentor request sent successfully! You will be notified once the mentor responds.');
    } catch (error) {
      console.error('Failed to send mentor request:', error);
      alert('Failed to send mentor request. Please try again.');
    }
  };

  // Filter and search logic for mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExpertise = filterExpertise.length === 0 ||
                             filterExpertise.every(filter => mentor.expertise.includes(filter));

    return matchesSearch && matchesExpertise;
  });

  // Example handler for "View Profile" - you'd integrate with React Router here
  const handleViewProfile = (mentorId: number) => {
    // For a real application, you'd navigate:
    // navigate(`/mentors/${mentorId}`);
    alert(`Navigating to mentor profile for ID: ${mentorId}`);
    console.log(`View profile for mentor ID: ${mentorId}`);
  };

  if (loading) {
    return <p className="p-4 text-center text-gray-700">Loading mentorship data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">
              Mentorship
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Your current mentor section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            {currentMentor ? (
              <>
                <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
                  Your Current Mentor
                </h2>
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                    <img src={currentMentor.image} alt={currentMentor.full_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-medium text-gray-800">
                      {currentMentor.full_name}
                    </h3>
                    <p className="text-gray-600">{currentMentor.role}</p>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <StarIcon size={16} className="text-accent fill-current" />
                      <span className="ml-1 text-gray-700">
                        {currentMentor.rating.toFixed(1)} {/* Display rating with one decimal */}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                      {currentMentor.expertise.map((skill, index) => (
                        <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col md:flex-row gap-3">
                      <Button variant="primary" onClick={() => console.log('Schedule session')}>
                        <CalendarIcon size={16} className="mr-2" />
                        Schedule Session
                      </Button>
                      <Button variant="outline" onClick={() => console.log('Send message')}>
                        <MessageSquareIcon size={16} className="mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-center py-4">You currently don't have an assigned mentor. Explore available mentors below!</p>
            )}
          </div>
          {/* Upcoming session - Placeholder for now, could be integrated with currentMentor */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
              Upcoming Session
            </h2>
            <div className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-center text-gray-600">
                <CalendarIcon size={16} className="mr-2" />
                <span>Tomorrow, 2:00 PM - 3:00 PM</span>
              </div>
              <h3 className="font-medium text-gray-800 mt-1">
                Career Planning Session with Amina
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Discuss your digital skills progress and career options in the
                tech field.
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="sm">Join Video Call</Button>
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
          {/* Find new mentors */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
              <h2 className="text-lg font-montserrat font-medium text-gray-800">
                Find New Mentors
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Filter Button - Placeholder for filter modal/dropdown */}
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 flex-shrink-0" onClick={() => alert('Filter functionality coming soon!')}>
                  <FilterIcon size={18} className="text-gray-600" />
                </button>
                {/* Search Input */}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search mentors..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {filteredMentors.length > 0 ? (
                filteredMentors.map(mentor => (
                  <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-center md:items-start">
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                      <img src={mentor.image} alt={mentor.full_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {mentor.full_name}
                          </h3>
                          <p className="text-gray-600">{mentor.role}</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <StarIcon size={16} className="text-accent fill-current" />
                          <span className="ml-1 text-gray-700">
                            {mentor.rating.toFixed(1)}
                          </span>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${mentor.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {mentor.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        <Button
                          variant={requestedMentors.has(mentor.id) ? 'secondary' : 'primary'}
                          disabled={!mentor.available || !!currentMentor || requestedMentors.has(mentor.id)}
                          onClick={() => handleRequestMentor(mentor.id)}
                        >
                          {requestedMentors.has(mentor.id) ? (
                            <>
                              <CheckIcon size={16} className="mr-2" />
                              Request Sent
                            </>
                          ) : (
                            'Request as Mentor'
                          )}
                        </Button>
                        <Button variant="outline" onClick={() => handleViewProfile(mentor.id)}>View Profile</Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 py-4">No mentors found matching your criteria.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default Mentorship;