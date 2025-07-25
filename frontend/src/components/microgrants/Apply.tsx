import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import api from '../../api/axios';

const Apply: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    location: '',
    business_name: '',
    business_description: '',
    grant_amount: '',
    budget_breakdown: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    // Check if user has already submitted an application
    const fetchApplication = async () => {
      try {
        const res = await api.get('/microgrants/applications/');
        if (res.data && res.data.length > 0) {
          setAlreadyApplied(true);
        }
      } catch (err) {
        console.error('Error checking application:', err);
      } finally {
        setLoadingCheck(false);
      }
    };

    fetchApplication();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionError('');
    try {
      await api.post('/microgrants/applications/', formData);
      setSubmissionSuccess(true);
      setAlreadyApplied(true); // Immediately disable form
      setFormData({
        full_name: '',
        location: '',
        business_name: '',
        business_description: '',
        grant_amount: '',
        budget_breakdown: '',
      });
    } catch (err) {
      console.error(err);
      setSubmissionError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCheck) {
    return <p className="text-sm text-gray-500">Checking application status...</p>;
  }

  if (alreadyApplied) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-700">
          You have already applied for a microgrant. You can check the status of your application in the{' '}
          <strong>Application Status</strong> tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div>
        <h2 className="text-lg font-montserrat font-medium text-gray-800">
            Apply for a Microgrant
        </h2>
        <p className="mt-2 text-gray-600">
            Microgrants of up to $500 are available to help you start
            or grow your business. Complete the form below to apply.
        </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
                1
            </span>
            Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
                </label>
                <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Current Location
                </label>
                <input
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
            </div>
            </div>
        </div>
        <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
                2
            </span>
            Business Idea
            </h3>
            <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
            </label>
            <input
                type="text"
                id="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
            </div>
            <div>
            <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Describe your business idea
            </label>
            <textarea 
                id="business_description"
                rows={4}
                value={formData.business_description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="What product or service will you offer? Who are your customers? Why is this needed in your community?"></textarea>
            </div>
        </div>
        <div className="space-y-4">
            <h3 className="font-medium text-gray-800 flex items-center">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">
                3
            </span>
            Budget Planning
            </h3>
            <div>
            <label htmlFor="grantAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Grant Amount Requested (up to $500)
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                $
                </span>
                <input
                type="number"
                id="grant_amount"
                value={formData.grant_amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="0.00"
                max="500"
                />
            </div>
            </div>
            <div>
            <label htmlFor="budgetBreakdown" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Breakdown
            </label>
            <textarea
                id="budget_breakdown"
                rows={4}
                value={formData.budget_breakdown}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="List the items you'll purchase and their approximate costs."></textarea>
            </div>
        </div>
        <div className="pt-4">
            <Button type="submit" fullWidth>
            Submit Application
            </Button>
            {submissionSuccess && (
            <p className="text-green-600 text-sm mt-2">Application submitted successfully!</p>
            )}
            {submissionError && (
            <p className="text-red-600 text-sm mt-2">{submissionError}</p>
            )}
        </div>
        </form>
    </div>
  );
};

export default Apply;
