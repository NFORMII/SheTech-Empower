import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, XCircleIcon, DollarSignIcon } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../Button';

const ApplicationStatus: React.FC = () => {
  const [application, setApplication] = useState<any>(null);
  const [additionalInfoResponse, setAdditionalInfoResponse] = useState('');

  const statusToStepIndex = {
    submitted: 0,
    under_review: 1,
    additional_info: 2,
    approved: 3,
    funded: 4,
  };

  const statusConfig = {
    approved: { icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />, color: 'text-green-600' },
    under_review: { icon: <ClockIcon className="h-5 w-5 text-blue-600" />, color: 'text-blue-600' },
    additional_info: { icon: <AlertCircleIcon className="h-5 w-5 text-yellow-600" />, color: 'text-yellow-600' },
    rejected: { icon: <XCircleIcon className="h-5 w-5 text-red-600" />, color: 'text-red-600' },
    funded: { icon: <DollarSignIcon className="h-5 w-5 text-purple-600" />, color: 'text-purple-600' },
  };

  useEffect(() => {
    api.get('/microgrants/applications/')
      .then((res) => setApplication(res.data[0]))
      .catch((err) => console.error(err));
  }, []);

  const currentStep = statusToStepIndex[application?.status] ?? -1;

  const applicationSteps = [
    { id: 1, name: 'Submit Application' },
    { id: 2, name: 'Initial Review' },
    { id: 3, name: 'Request for More Info' },
    { id: 4, name: 'Final Decision' },
    { id: 5, name: 'Fund Disbursement' },
  ].map((step, index) => ({
    ...step,
    status:
      index < currentStep ? 'complete' :
      index === currentStep ? 'current' : 'upcoming'
  }));

  return (
    <div className="space-y-6">
        {application ? (
        <>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
                <div className="flex-shrink-0">
                {statusConfig[application.status]?.icon}
                </div>
                <div className="ml-3">
                <p className={`text-sm ${statusConfig[application.status]?.messageColor || 'text-gray-700'}`}>
                    Your application is currently{' '}
                    <strong className={statusConfig[application.status]?.color || 'text-gray-600'}>
                    {application.status.replace('_', ' ')}
                    </strong>.
                </p>
                </div>
            </div>
            </div>
            <div>
            <h3 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
                Application Progress
            </h3>
            <div className="overflow-hidden">
                <ul className="relative border-l border-gray-200 ml-3">
                {applicationSteps.map(step => (
                <li key={step.id} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3">
                    {step.status === 'complete' ? <CheckCircleIcon className="w-6 h-6 text-green-500 bg-white" /> :
                    step.status === 'current' ? <ClockIcon className="w-6 h-6 text-blue-500 bg-white" /> :
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                    </span>
                    <h4 className={`font-medium ${
                    step.status === 'complete' ? 'text-green-500' :
                    step.status === 'current' ? 'text-blue-500' :
                    'text-gray-400'
                    }`}>
                    {step.name}
                    </h4>
                </li>
                ))}
                </ul>
            </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Application Details</h3>
            <div className="space-y-3">
                <div className="flex justify-between">
                <span className="text-sm text-gray-500">Full Name:</span>
                <span className="text-sm font-medium">{application.full_name}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-sm text-gray-500">Business Idea:</span>
                <span className="text-sm font-medium">{application.business_name}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-sm text-gray-500">Amount Requested:</span>
                <span className="text-sm font-medium">${application.grant_amount}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-sm text-gray-500">Submission Date:</span>
                <span className="text-sm font-medium">{application.submission_date}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`text-sm font-medium ${
                    application.status === 'approved' ? 'text-green-600' :
                    application.status === 'additional_info' ? 'text-yellow-600' :
                    application.status === 'under_review' ? 'text-blue-600' :
                    application.status === 'funded' ? 'text-purple-600' :
                    application.status === 'rejected' ? 'text-red-600' :
                    'text-gray-600'
                }`}>
                    {application.status.replace('_', ' ')}
                </span>
                </div>
                {application.additional_info_response && (
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Additional Info Response:</span>
                    <span className="text-sm font-medium">{application.additional_info_response}</span>
                </div>
                )}
            </div>

            {application.status === 'additional_info' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Additional Information Required:</h4>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                    <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                        {application.additional_info_required}
                        </p>
                    </div>
                    </div>
                </div>

                <form
                    onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                        const res = await api.patch(`/microgrants/applications/${application.id}/`, {
                        additional_info_response: additionalInfoResponse,
                        status: 'under_review'
                        });
                        alert('Response submitted successfully!');
                        setApplication(res.data); // Refresh state with updated data
                        setAdditionalInfoResponse('');
                    } catch (err) {
                        console.error(err);
                        alert('Failed to submit response. Please try again.');
                    }
                    }}
                    className="space-y-4"
                >
                    <div>
                    <label htmlFor="additional_info_response" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Response
                    </label>
                    <textarea
                        id="additional_info_response"
                        value={additionalInfoResponse}
                        onChange={(e) => setAdditionalInfoResponse(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        required
                    />
                    </div>

                    <div>
                    <Button type="submit">Submit Additional Information</Button>
                    </div>
                </form>
                </div>
            )}

            </div>
        </>
        ) : (
            <p className="text-sm text-gray-600">You haven’t applied for a microgrant yet.</p>
        )}
    </div>
  );
};

export default ApplicationStatus;
