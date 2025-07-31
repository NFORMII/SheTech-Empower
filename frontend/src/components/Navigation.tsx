import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from './LogoutButton';
import { useAuth } from '../context/AuthContext.tsx';
import { HomeIcon, HeartIcon, BookOpenIcon, UsersIcon, GiftIcon, BookIcon, UserCheck, Calendar, GraduationCap, MessageSquare, UserCircle, Settings, BarChart3, HandHeart } from 'lucide-react';

// Menu items by role
const youthMenu = [
  { path: '/dashboard', label: 'Home', icon: <HomeIcon size={20} /> },
  { path: '/healing', label: 'Healing', icon: <HeartIcon size={20} /> },
  { path: '/learn', label: 'Learn', icon: <BookOpenIcon size={20} /> },
  { path: '/mentorship', label: 'Mentors', icon: <UsersIcon size={20} /> },
  { path: '/microgrant', label: 'Grants', icon: <GiftIcon size={20} /> },
  { path: '/my-story', label: 'My Story', icon: <BookIcon size={20} /> },
  { path: '/my-profile', label: 'My Profile', icon: <UserCircle  size={20} /> },
];

const mentorMenu = [
  { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon size={20} /> },
  { path: '/mentor/mentees', label: 'My Mentees', icon: <UsersIcon size={20} /> },
  { path: '/mentor/applications', label: 'Applications', icon: <UserCheck size={20} /> },
  { path: '/mentor/sessions', label: 'Sessions', icon: <Calendar size={20} /> },
  { path: '/mentor/stories', label: 'Stories', icon: <BookOpenIcon size={20} /> },
  { path: '/mentor/microgrants', label: 'Microgrants', icon: <GiftIcon size={20} /> },
  { path: '/mentor/resources', label: 'Resources', icon: <GraduationCap size={20} /> },
  { path: '/mentor/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
  { path: '/mentor/settings', label: 'Settings', icon: <Settings size={20} /> },
  { path: '/my-profile', label: 'My Profile', icon: <UserCircle size={20} /> },
];

const donorMenu = [
  { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon size={20} /> },
  { path: '/donor/stories', label: 'Stories', icon: <BookOpenIcon size={20} /> },
  { path: '/donor/microgrants', label: 'Microgrants', icon: <GiftIcon size={20} /> },
  { path: '/donor/impact', label: 'Impact', icon: <BarChart3 size={20} /> },
  { path: '/donor/community', label: 'Community', icon: <UsersIcon size={20} /> },
  
  { path: '/donor/history', label: 'Giving History', icon: <HandHeart size={20} /> },
  { path: '/donor/settings', label: 'Settings', icon: <Settings size={20} /> },
  { path: '/my-profile', label: 'My Profile', icon: <UserCircle size={20} /> },
];


export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getMenu = () => {
    if (user?.role === 'mentor') return mentorMenu;
    if (user?.role === 'donor') return donorMenu;
    return youthMenu;
  };

  const navItems = getMenu();
  const isActive = (path: string) => location.pathname.startsWith(path);
  // const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center px-2 py-1 transition-colors duration-200 ${
              isActive(item.path) ? 'text-primary font-semibold' : 'text-gray-500 hover:text-primary'
            }`}>
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export const SideNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getMenu = () => {
    switch (user?.role) {
      case 'mentor': return mentorMenu;
      case 'donor': return donorMenu;
      case 'youth': return youthMenu;
      default: return []; // or null
    }
  };


  const navItems = getMenu();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-montserrat font-bold text-primary">SheTech Empower</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.path}>
              <Link to={item.path} className={`flex items-center p-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>
                <div className="mr-3">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </div>
  );
};
