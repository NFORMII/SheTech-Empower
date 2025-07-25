import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { CalendarIcon, MessageSquareIcon, SearchIcon, FilterIcon, StarIcon, CheckIcon } from 'lucide-react';

interface Mentor {
  id: number;
  name: string;
  role: string;
  expertise: string[];
  image: string;
  rating: number;
  available: boolean;
}

const Mentorship: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get('/mentor/');
        setMentors(response.data);

        const assigned = await api.get('/mentor/my/');
        setCurrentMentor(assigned.data);
        
      } catch (error) {
        console.error('Failed to load mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);



  if (loading) {
    return <p className="p-4">Loading mentors...</p>;
  }

  return <div className="min-h-screen bg-gray-50 flex">
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
          {/* Your mentor section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            {currentMentor ? (
              <>
                <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
                  Your Current Mentor
                </h2>
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                    <img src={currentMentor.image} alt={currentMentor.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-medium text-gray-800">
                      {currentMentor.full_name}
                    </h3>
                    <p className="text-gray-600">{currentMentor.role}</p>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <StarIcon size={16} className="text-accent fill-current" />
                      <span className="ml-1 text-gray-700">
                        {currentMentor.rating}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                      {currentMentor.expertise.map((skill, index) => <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>)}
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
              <p className="text-gray-600">No mentor assigned yet.</p>
            )}
          </div>
          {/* Upcoming session */}
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-montserrat font-medium text-gray-800">
                Find New Mentors
              </h2>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <FilterIcon size={18} className="text-gray-600" />
                </button>
                <div className="relative">
                  <input type="text" placeholder="Search mentors..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                  <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {mentors.map(mentor => <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row">
                  <div className="flex items-center md:items-start mb-4 md:mb-0 md:mr-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img src={mentor.image} alt={mentor.full_name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-grow">
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
                          {mentor.rating}
                        </span>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${mentor.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {mentor.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>)}
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Button variant={mentor.id === 1 ? 'secondary' : 'primary'} disabled={!mentor.available}>
                        {mentor.id === 1 ? <>
                            <CheckIcon size={16} className="mr-2" />
                            Current Mentor
                          </> : 'Request as Mentor'}
                      </Button>
                      <Button variant="outline">View Profile</Button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </main>
        
      </div>
      <Navigation />
    </div>;
};
export default Mentorship;