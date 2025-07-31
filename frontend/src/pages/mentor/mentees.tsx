// src/pages/MyMenteesPage.tsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Trash2 } from 'lucide-react';

interface Mentee {
  id: string;
  name: string;
  email: string;
  avatar: string; // URL to mentee's avatar
  program: string;
  lastInteraction: string; // e.g., "2 days ago"
}

export const MyMenteesPage: React.FC = () => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchMentees = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, you'd make an API call here:
        // const response = await fetch('/api/mentor/mentees');
        // if (!response.ok) throw new Error('Failed to fetch mentees');
        // const data = await response.json();
        // setMentees(data);

        // Mock data for demonstration
        const mockMentees: Mentee[] = [
          {
            id: 'mentee1',
            name: 'Alice Johnson',
            email: 'alice.j@example.com',
            avatar: 'https://via.placeholder.com/40/FF5733/FFFFFF?text=AJ',
            program: 'Career Development',
            lastInteraction: '2 days ago',
          },
          {
            id: 'mentee2',
            name: 'Bob Williams',
            email: 'bob.w@example.com',
            avatar: 'https://via.placeholder.com/40/33A0FF/FFFFFF?text=BW',
            program: 'Skill Enhancement',
            lastInteraction: '1 week ago',
          },
          {
            id: 'mentee3',
            name: 'Charlie Brown',
            email: 'charlie.b@example.com',
            avatar: 'https://via.placeholder.com/40/33FF57/FFFFFF?text=CB',
            program: 'Entrepreneurship',
            lastInteraction: 'Today',
          },
        ];
        setMentees(mockMentees);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  const handleMessageMentee = (menteeId: string) => {
    console.log(`Navigating to message with mentee: ${menteeId}`);
    // In a real app, navigate to a chat page with the mentee's ID
    // navigate(`/mentor/messages?menteeId=${menteeId}`);
  };

  const handleScheduleSession = (menteeId: string) => {
    console.log(`Scheduling session for mentee: ${menteeId}`);
    // Navigate to a session scheduling page, pre-filled for this mentee
    // navigate(`/mentor/sessions/schedule?menteeId=${menteeId}`);
  };

  const handleRemoveMentee = async (menteeId: string) => {
    if (window.confirm('Are you sure you want to remove this mentee? This action cannot be undone.')) {
      console.log(`Removing mentee: ${menteeId}`);
      // In a real app, send a DELETE request to your API
      // try {
      //   const response = await fetch(`/api/mentor/mentees/${menteeId}`, { method: 'DELETE' });
      //   if (!response.ok) throw new Error('Failed to remove mentee');
      //   setMentees(mentees.filter(m => m.id !== menteeId));
      //   alert('Mentee removed successfully!');
      // } catch (err: any) {
      //   alert(`Error removing mentee: ${err.message}`);
      // }
      setMentees(mentees.filter(m => m.id !== menteeId)); // Optimistic update for demo
      alert('Mentee removed successfully! (Simulated)');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading mentees...
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Mentees</h1>
      <p className="text-gray-600 mb-8">View and manage your current mentees.</p>

      {mentees.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          <p className="text-lg mb-4">You currently don't have any active mentees.</p>
          <p>Consider reviewing <Link to="/mentor/applications" className="text-primary hover:underline">mentorship applications</Link>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentees.map((mentee) => (
            <div key={mentee.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <img
                src={mentee.avatar}
                alt={mentee.name}
                className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-primary"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{mentee.name}</h2>
              <p className="text-gray-500 text-sm mb-2">{mentee.email}</p>
              <p className="text-gray-700 text-base mb-4 italic">{mentee.program}</p>
              <p className="text-gray-500 text-sm mb-4">Last Interaction: {mentee.lastInteraction}</p>
              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={() => handleMessageMentee(mentee.id)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  title="Message Mentee"
                >
                  <MessageSquare size={20} />
                </button>
                <button
                  onClick={() => handleScheduleSession(mentee.id)}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  title="Schedule Session"
                >
                  <Calendar size={20} />
                </button>
                <button
                  onClick={() => handleRemoveMentee(mentee.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title="Remove Mentee"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Implement a "View Profile" button for each mentee to see detailed information (progress, goals, notes).</li>
          <li>Add search and filter functionalities (by program, last interaction, etc.).</li>
          <li>Integrate with a real-time messaging system (e.g., Firebase, WebSockets).</li>
          <li>Show a "Mentee Progress" chart/graph.</li>
          <li>Option to "Archive" mentees instead of permanently removing them.</li>
        </ul>
      </div>
    </div>
  );
};

// You'll need Link from react-router-dom for this.
import { Link } from 'react-router-dom';
























// import React, { useEffect, useState } from 'react';
// import api from '../../api/axios';
// import { Navigation } from '../../components/Navigation';
// import { MentorSideNavigation } from '../../components/MentorSideNavigation';
// import { MessageSquare, Calendar, Clock } from 'lucide-react';

// interface Mentee {
//   id: number;
//   name: string;
//   email: string;
//   location: string;
//   avatar?: string;
//   goals: string;
//   progress_status: 'early' | 'ongoing' | 'advanced';
//   last_session?: string;
//   next_session?: string;
// }

// const MentorMentees: React.FC = () => {
//   const [mentees, setMentees] = useState<Mentee[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchMentees = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/mentor/mentees/');
//         setMentees(response.data);
//       } catch (err: any) {
//         console.error('Failed to load mentees:', err);
//         setError(err.response?.data?.message || 'Failed to load mentees');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMentees();
//   }, []);

//   if (loading) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-600">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <MentorSideNavigation />
//       <div className="flex-grow pb-20 md:pb-0 md:ml-64">
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//             <h1 className="text-xl font-montserrat font-bold text-gray-900">My Mentees</h1>
//             <p className="text-gray-600 mt-1">Manage and track your mentees' progress</p>
//           </div>
//         </header>

//         <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 gap-6">
//             {mentees.map((mentee) => (
//               <div 
//                 key={mentee.id} 
//                 className="bg-white shadow rounded-lg overflow-hidden"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center">
//                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
//                         {mentee.avatar ? (
//                           <img 
//                             src={mentee.avatar} 
//                             alt={mentee.name} 
//                             className="h-12 w-12 rounded-full"
//                           />
//                         ) : (
//                           <span className="text-xl font-medium text-primary">
//                             {mentee.name.charAt(0)}
//                           </span>
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <h3 className="text-lg font-medium text-gray-900">{mentee.name}</h3>
//                         <p className="text-sm text-gray-500">{mentee.location}</p>
//                       </div>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-sm ${
//                       mentee.progress_status === 'early' ? 'bg-blue-100 text-blue-800' :
//                       mentee.progress_status === 'ongoing' ? 'bg-green-100 text-green-800' :
//                       'bg-purple-100 text-purple-800'
//                     }`}>
//                       {mentee.progress_status.charAt(0).toUpperCase() + mentee.progress_status.slice(1)}
//                     </span>
//                   </div>

//                   <div className="mt-4">
//                     <h4 className="text-sm font-medium text-gray-900">Goals</h4>
//                     <p className="mt-1 text-sm text-gray-600">{mentee.goals}</p>
//                   </div>

//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Clock className="h-4 w-4 mr-2" />
//                       <span>Last Session: {mentee.last_session || 'None'}</span>
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       <span>Next Session: {mentee.next_session || 'None scheduled'}</span>
//                     </div>
//                     <button
//                       className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
//                     >
//                       <MessageSquare className="h-4 w-4 mr-2" />
//                       Message
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>
//       <Navigation />
//     </div>
//   );
// };

// export default MentorMentees;
