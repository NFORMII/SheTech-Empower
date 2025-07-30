import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation } from '../components/Navigation';
import { MentorSideNavigation } from '../components/MentorSideNavigation';
import { SmileIcon, BookOpenIcon, UsersIcon, GiftIcon, BellIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  message: string;
  timestamp: string;
}

interface DashboardData {
  name: string;
  mentees_assigned: number;
  sessions_this_week: number;
  notifications: Notification[];
}

const MentorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get('/dashboard/');
        if (!res.data) {
          throw new Error('No data received from server');
        }
        setDashboardData(res.data);
      } catch (err: any) {
        console.error('Failed to load mentor dashboard:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);


  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center py-10">No dashboard data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MentorSideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">Welcome, {dashboardData.name || 'Mentor'}!</h1>
            <p className="text-gray-600 mt-1">Here’s an overview of your mentorship activity.</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assigned Mentees */}
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <UsersIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Assigned Mentees</h3>
                  <p className="text-2xl font-bold text-purple-700">{dashboardData.mentees_assigned || 0}</p>
                </div>
              </div>
            </div>

            {/* Sessions Scheduled */}
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-500">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-full mr-4">
                  <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Sessions This Week</h3>
                  <p className="text-2xl font-bold text-indigo-700">{dashboardData.sessions_this_week || 0}</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500 md:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-montserrat font-medium text-gray-800">Mentor Notifications</h3>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <BellIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="space-y-4">
                {dashboardData?.notifications?.length > 0 ? (
                  dashboardData.notifications.map((n, index) => (
                    <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
                      <p className="text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(n.timestamp))} ago</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent notifications.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default MentorDashboard;



// import React, { useEffect, useState } from 'react';
// import api from '../api/axios';
// import { Navigation, SideNavigation } from '../components/Navigation';
// import { UsersIcon, BookOpenIcon, BellIcon } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';

// interface Notification {
//   message: string;
//   timestamp: string;
// }

// interface DashboardData {
//   name: string;
//   mentees_assigned: number;
//   sessions_this_week: number;
//   notifications: Notification[];
// }

// const MentorDashboard: React.FC = () => {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const res = await api.get('/mentor/dashboard/');
//         console.log(res, "From api requests");
//         if (!res.data) {
//           throw new Error('No data received from server');
//         }
//         setDashboardData(res.data);
//       } catch (err: any) {
//         console.error('Failed to load mentor dashboard:', err);
//         setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, []);

//   if (isLoading) {
//     return <div className="text-center py-10">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-600 mb-4">{error}</p>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="text-blue-500 hover:text-blue-700 underline"
//         >
//           Try again
//         </button>
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return <div className="text-center py-10">No dashboard data available</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <SideNavigation />
//       <div className="flex-grow pb-20 md:pb-0 md:ml-64">
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//             <h1 className="text-xl font-montserrat font-bold text-gray-900">Welcome, {dashboardData.name || 'Mentor'}!</h1>
//             <p className="text-gray-600 mt-1">Here’s an overview of your mentorship activity.</p>
//           </div>
//         </header>

//         <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Assigned Mentees */}
//             <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
//               <div className="flex items-center">
//                 <div className="p-2 bg-purple-100 rounded-full mr-4">
//                   <UsersIcon className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-800">Assigned Mentees</h3>
//                   <p className="text-2xl font-bold text-purple-700">{dashboardData.mentees_assigned || 0}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Sessions Scheduled */}
//             <div className="bg-white shadow rounded-lg p-6 border-l-4 border-indigo-500">
//               <div className="flex items-center">
//                 <div className="p-2 bg-indigo-100 rounded-full mr-4">
//                   <BookOpenIcon className="h-6 w-6 text-indigo-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-800">Sessions This Week</h3>
//                   <p className="text-2xl font-bold text-indigo-700">{dashboardData.sessions_this_week || 0}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500 md:col-span-2 lg:col-span-3">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-montserrat font-medium text-gray-800">Mentor Notifications</h3>
//                 <div className="p-2 bg-yellow-100 rounded-full">
//                   <BellIcon className="h-5 w-5 text-yellow-600" />
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 {dashboardData?.notifications?.length > 0 ? (
//                   dashboardData.notifications.map((n, index) => (
//                     <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2">
//                       <p className="text-gray-800">{n.message}</p>
//                       <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(n.timestamp))} ago</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No recent notifications.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       <Navigation />
//     </div>
//   );
// };

// export default MentorDashboard
