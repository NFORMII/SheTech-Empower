import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen,
  Gift,
  UserCheck,
  Calendar,
  MessageSquare,
  Settings,
  GraduationCap
} from 'lucide-react';

export const MentorSideNavigation: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/mentor', 
      icon: LayoutDashboard,
      description: 'Overview of your mentorship activities'
    },
    { 
      name: 'My Mentees', 
      path: '/mentor/mentees', 
      icon: Users,
      description: 'View and manage your current mentees'
    },
    { 
      name: 'Mentorship Applications', 
      path: '/mentor/applications', 
      icon: UserCheck,
      description: 'Review mentorship applications'
    },
    { 
      name: 'Sessions', 
      path: '/mentor/sessions', 
      icon: Calendar,
      description: 'Manage your mentoring sessions'
    },
    { 
      name: 'People Stories', 
      path: '/mentor/stories', 
      icon: BookOpen,
      description: 'View mentee success stories'
    },
    { 
      name: 'Microgrant Reviews', 
      path: '/mentor/microgrants', 
      icon: Gift,
      description: 'Review microgrant applications'
    },
    { 
      name: 'Resources', 
      path: '/mentor/resources', 
      icon: GraduationCap,
      description: 'Mentoring resources and guides'
    },
    { 
      name: 'Messages', 
      path: '/mentor/messages', 
      icon: MessageSquare,
      description: 'Chat with your mentees'
    },
    {
      name: 'Settings',
      path: '/mentor/settings',
      icon: Settings,
      description: 'Manage your mentor profile and preferences'
    }
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <h1 className="text-xl font-montserrat font-bold text-primary">
            Mentor Portal
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
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors relative ${
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
                  <span className="flex-1">{item.name}</span>
                  {item.path === '/mentor/applications' && (
                    <span className="ml-3 inline-block py-0.5 px-2 text-xs rounded-full bg-red-100 text-red-600">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center w-full">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Active Mentees</p>
              <p className="text-xs text-gray-500">Currently mentoring 5 people</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
