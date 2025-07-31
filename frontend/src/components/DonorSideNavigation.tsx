import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  HandHeart, 
  Gift, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

export const DonorSideNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens or user data from localStorage
    localStorage.clear();
    // Navigate to login page
    navigate('/login');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/donor', 
      icon: LayoutDashboard 
    },
    { 
      name: 'People Stories', 
      path: '/donor/stories', 
      icon: BookOpen,
      description: 'Browse stories of people seeking support'
    },
    { 
      name: 'Microgrants', 
      path: '/donor/microgrants', 
      icon: Gift,
      description: 'View and support microgrant applications'
    },
    { 
      name: 'Impact Tracking', 
      path: '/donor/impact', 
      icon: BarChart3,
      description: 'Track the impact of your donations'
    },
    { 
      name: 'Community', 
      path: '/donor/community', 
      icon: Users,
      description: 'Connect with other donors'
    },
    { 
      name: 'Giving History', 
      path: '/donor/history', 
      icon: HandHeart,
      description: 'View your donation history'
    },
    {
      name: 'Settings',
      path: '/donor/settings',
      icon: Settings,
      description: 'Manage your donor preferences'
    },
    {
      name: 'Profile',
      path: '/my-profile',
      icon: Settings,
      description: 'Manage your donor preferences'
    }
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <h1 className="text-xl font-montserrat font-bold text-primary">
            SheTech Empower
          </h1>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
