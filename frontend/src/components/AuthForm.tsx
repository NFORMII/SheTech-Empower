import React, { useState } from 'react';
import { Button } from './Button';
interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => void;
}
export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {type === 'signup' && <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required={type === 'signup'} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Your name" />
        </div>}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="your.email@example.com" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="••••••••" />
      </div>
      <Button type="submit" fullWidth>
        {type === 'login' ? 'Log In' : 'Sign Up'}
      </Button>
    </form>;
};