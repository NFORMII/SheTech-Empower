import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from './LogoutButton';
import { HomeIcon, HeartIcon, BookOpenIcon, UsersIcon, GiftIcon, BookIcon } from 'lucide-react';
export const Navigation: React.FC = () => {
  const location = useLocation();
  const navItems = [{
    path: '/dashboard',
    label: 'Home',
    icon: <HomeIcon size={20} />
  }, {
    path: '/healing',
    label: 'Healing',
    icon: <HeartIcon size={20} />
  }, {
    path: '/learn',
    label: 'Learn',
    icon: <BookOpenIcon size={20} />
  }, {
    path: '/mentorship',
    label: 'Mentors',
    icon: <UsersIcon size={20} />
  }, {
    path: '/microgrant',
    label: 'Grants',
    icon: <GiftIcon size={20} />
  }, {
    path: '/my-story',
    label: 'My Story',
    icon: <BookIcon size={20} />
  }, {
    path: '/my-profile',
    label: 'My Profile',
    icon: <BookIcon size={20} />
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center px-2 py-1 ${isActive(item.path) ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}>
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>)}
      </div>
    </nav>;
};
export const SideNavigation: React.FC = () => {
  const location = useLocation();
  const navItems = [{
    path: '/dashboard',
    label: 'Dashboard',
    icon: <HomeIcon size={20} />
  }, {
    path: '/healing',
    label: 'Healing Center',
    icon: <HeartIcon size={20} />
  }, {
    path: '/learn',
    label: 'Learning Hub',
    icon: <BookOpenIcon size={20} />
  }, {
    path: '/mentorship',
    label: 'Mentorship',
    icon: <UsersIcon size={20} />
  }, {
    path: '/microgrant',
    label: 'Microgrants',
    icon: <GiftIcon size={20} />
  }, {
    path: '/my-story',
    label: 'My Story Wall',
    icon: <BookIcon size={20} />
  }, {
    path: '/my-profile',
    label: 'My Profile',
    icon: <BookIcon size={20} />
  }];
  const isActive = (path: string) => location.pathname === path;
  return <div className="hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-montserrat font-bold text-primary">
          SheTech Empower
        </h1>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map(item => <li key={item.path}>
              <Link to={item.path} className={`flex items-center p-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>
                <div className="mr-3">{item.icon}</div>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>)}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </div>
    </div>;
};