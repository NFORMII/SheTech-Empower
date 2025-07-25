import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Navigation, SideNavigation } from '../components/Navigation';
import { Button } from '../components/Button';
import {
  LaptopIcon,
  CodeIcon,
  DollarSignIcon,
  TrendingUpIcon,
  DownloadIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon
} from 'lucide-react';

const iconMap = {
  'computer': <LaptopIcon size={24} />,
  'code': <CodeIcon size={24} />,
  'finance': <DollarSignIcon size={24} />,
  'marketing': <TrendingUpIcon size={24} />,
};

const Learn: React.FC = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/learning/enrollments/');
      setEnrollments(res.data);
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await api.post('/learning/enrollments/', { course: courseId });
      await fetchEnrollments(); // Refresh
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const completedCount = enrollments.filter((e) => e.completed).length;
  const averageProgress = enrollments.length > 0
  ? enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length
  : 0;


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNavigation />
      <div className="flex-grow pb-20 md:pb-0 md:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-montserrat font-bold text-gray-900">
              Learning Hub
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Progress Overview */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-montserrat font-medium text-gray-800">
                Your Learning Journey
              </h2>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {completedCount} of {enrollments.length} courses completed
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <BookOpenIcon size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {enrollments.length} courses enrolled
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {completedCount} certificate{completedCount !== 1 ? 's' : ''} earned
                </span>
              </div>
            </div>
          </div>

          {/* Course Catalog */}
          <div className="mb-6">
            <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
              Your Courses
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((enroll) => {
                  const { id, course, progress, completed, certificate_url } = enroll;
                  const iconKey = course.icon?.toLowerCase() || '';
                  return (
                    <div key={id} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className={`${course.color} h-2`}></div>
                      <div className="p-6">
                        <div className="flex items-start">
                          <div className={`${course.color.replace('bg-', 'bg-').replace('500', '100')} p-3 rounded-lg`}>
                            {iconMap[iconKey] || <BookOpenIcon size={24} />}
                          </div>
                          <div className="ml-4">
                            <h3 className="font-montserrat font-medium text-gray-800">
                              {course.title}
                            </h3>
                            <div className="flex items-center mt-1 space-x-4">
                              <div className="flex items-center">
                                <ClockIcon size={14} className="text-gray-500 mr-1" />
                                <span className="text-xs text-gray-500">{course.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <BookOpenIcon size={14} className="text-gray-500 mr-1" />
                                <span className="text-xs text-gray-500">
                                  {course.modules} modules
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-3">{course.description}</p>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">{progress}% complete</span>
                            {progress > 0 && (
                              <span className="text-xs text-primary">
                                {completed ? 'Completed' : 'In progress'}
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <Button variant={completed ? 'secondary' : 'primary'}>
                            {progress === 0
                              ? 'Start Course'
                              : completed
                              ? 'Review Course'
                              : 'Continue Learning'}
                          </Button>
                          {certificate_url && (
                            <a
                              href={certificate_url}
                              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full"
                              download
                            >
                              <DownloadIcon size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
              Your Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {enrollments.map((e) => {
                const iconKey = e.course.icon?.toLowerCase() || '';
                return (
                  <div
                    key={e.id}
                    className={`flex flex-col items-center p-4 border border-gray-200 rounded-lg ${
                      e.completed ? '' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      {iconMap[iconKey] || <BookOpenIcon size={24} />}
                    </div>
                    <h3 className="font-medium text-center">{e.course.title}</h3>
                    <p className="text-xs text-center mt-1">
                      {e.completed ? 'Certificate Earned' : 'In Progress'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <Navigation />
    </div>
  );
};

export default Learn;
