import React, { useState, useEffect } from 'react';
import { ImageIcon, DollarSignIcon, PlusIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../Button';
import api from '../../api/axios';

const SuccessStory: React.FC = () => {
  const [successStories, setSuccessStories] = useState([]);
  const [content, setContent] = useState('');
  const [amount, setAmount] = useState('');
  const [business, setBusiness] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/microgrants/success-stories/')
      .then((res) => setSuccessStories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmitStory = async () => {
    if (!content.trim() || !amount || !business) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("story", content);
    formData.append("amount", amount);
    formData.append("business", business);
    formData.append("name", isAnonymous ? "Anonymous" : "");
    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      await api.post("/microgrants/success-stories/", formData);
      alert("Story submitted!");
      setContent('');
      setAmount('');
      setBusiness('');
      setImageFile(null);
      setIsAnonymous(false);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
        <h2 className="text-lg font-montserrat font-medium text-gray-800">
        Success Stories
        </h2>
        <p className="text-gray-600">
        Learn from women who have successfully used their
        microgrants to start businesses and improve their lives.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {successStories.map(story => <div key={story.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-48 overflow-hidden">
                <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">
                    {story.name}
                </h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <DollarSignIcon size={12} className="mr-1" />
                    {story.amount}
                </span>
                </div>
                <p className="text-primary font-medium text-sm mb-2">
                {story.business}
                </p>
                <p className="text-gray-600 text-sm">{story.story}</p>
                <button className="mt-4 flex items-center text-primary hover:underline">
                Read full story
                <ChevronRightIcon size={16} className="ml-1" />
                </button>
            </div>
            </div>)}
        </div>
        <div className="bg-primary/5 rounded-lg p-6 mt-6">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-montserrat font-medium text-gray-800 mb-4">
            Share Your Story
            </h2>

            <div className="space-y-4">
            {/* Story Text */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Share how the grant helped your business..."
                required
            />

            {/* Grant Amount */}
            <div>
                <label className="text-sm text-gray-700">Business</label>
                <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., Digital Design Studio"
                required
                />

                <label className="text-sm text-gray-700">Grant Amount Received ($)</label>
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., 500"
                required
                />
            </div>

            {/* Category and Upload */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                {/* Image Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                    className="hidden"
                    id="imageUpload"
                />
                <label htmlFor="imageUpload" className="flex items-center text-gray-500 hover:text-primary cursor-pointer">
                    <ImageIcon size={18} className="mr-1" />
                    <span className="text-sm">{imageFile ? 'Photo selected' : 'Add Photo'}</span>
                </label>
                </div>

                {/* Anonymity and Submit */}
                <div className="flex items-center space-x-4">
                <label className="flex items-center text-sm text-gray-600">
                    <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mr-2"
                    />
                    Post anonymously
                </label>
                <Button onClick={handleSubmitStory} disabled={submitting}>
                    <PlusIcon size={16} className="mr-2" />
                    {submitting ? 'Sharing...' : 'Share Story'}
                </Button>
                </div>
            </div>
            </div>
        </div>

        </div>
    </div>
  );
};

export default SuccessStory;
