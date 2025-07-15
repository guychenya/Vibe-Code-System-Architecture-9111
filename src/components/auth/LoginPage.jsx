import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const { FiCode, FiShield, FiUsers, FiGithub, FiMail, FiLock, FiEye, FiEyeOff, FiLoader } = FiIcons;

// Export the component as default
export default function LoginPage() {
  const { signIn, signUp, isLoading, error } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (authMode === 'signup') {
        if (emailForm.password !== emailForm.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        if (emailForm.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        if (!emailForm.name.trim()) {
          toast.error('Name is required');
          return;
        }
        await signUp(emailForm.email, emailForm.password, { name: emailForm.name });
      } else {
        await signIn('email', emailForm.email, emailForm.password);
      }
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
    }
  };

  const handleProviderLogin = async (providerId) => {
    try {
      await signIn(providerId);
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-primary-600 p-3 rounded-lg">
              <SafeIcon icon={FiCode} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-800">Vibe Code System</h1>
              <p className="text-gray-600">Streamline your development workflow</p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: FiCode,
                title: 'Code Version Management',
                description: 'Track and manage your code versions with full history'
              },
              {
                icon: FiUsers,
                title: 'Team Collaboration',
                description: 'Real-time chat and seamless team communication'
              },
              {
                icon: FiShield,
                title: 'Secure Authentication',
                description: 'Multiple authentication options with enterprise-grade security'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <SafeIcon icon={feature.icon} className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-dark-800 mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {authMode === 'login' 
                ? 'Sign in to your account to continue' 
                : 'Sign up to get started with Vibe Code System'}
            </p>
          </div>

          {(error || formError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiShield} className="text-red-600" />
                <span className="text-red-700 text-sm">{error || formError}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={emailForm.confirmPassword}
                    onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <SafeIcon icon={FiLoader} className="animate-spin" />
              ) : (
                <SafeIcon icon={FiMail} />
              )}
              <span>
                {isLoading 
                  ? 'Processing...' 
                  : authMode === 'login' 
                    ? 'Sign In' 
                    : 'Create Account'
                }
              </span>
            </button>
          </form>

          <div className="text-center mb-6">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setEmailForm({ email: '', password: '', confirmPassword: '', name: '' });
                setFormError('');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"
              }
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => handleProviderLogin('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <SafeIcon icon={FiGithub} />
            <span>Continue with GitHub</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}