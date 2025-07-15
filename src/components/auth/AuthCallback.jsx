import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import authService from '../../services/auth-service.js';
import toast from 'react-hot-toast';
import supabase from '../../lib/supabase.js';

const { FiLoader, FiCheckCircle, FiXCircle } = FiIcons;

function AuthCallback() {
  const { provider } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        
        // For GitHub auth via Supabase
        if (provider === 'github') {
          // The hash contains the access token
          if (window.location.hash) {
            // Supabase handles this automatically, just get the session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            if (!session) throw new Error('No session found after authentication');
            
            const { data: { user } } = await supabase.auth.getUser();
            
            setStatus('success');
            setMessage(`Welcome back, ${user.user_metadata?.name || user.email}!`);
            toast.success(`Successfully signed in with ${provider}`);
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/');
            }, 2000);
            return;
          }
        }
        
        // Fallback to OIDC for other providers
        const user = await authService.handleCallback(provider, searchParams);
        
        setStatus('success');
        setMessage(`Welcome back, ${user.name}!`);
        toast.success(`Successfully signed in with ${provider}`);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
        toast.error(`Authentication failed: ${error.message}`);
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [provider, location.search, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <SafeIcon icon={FiLoader} className="text-4xl text-primary-600 animate-spin" />;
      case 'success':
        return <SafeIcon icon={FiCheckCircle} className="text-4xl text-green-600" />;
      case 'error':
        return <SafeIcon icon={FiXCircle} className="text-4xl text-red-600" />;
      default:
        return <SafeIcon icon={FiLoader} className="text-4xl text-primary-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-primary-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-primary-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        <h1 className="text-2xl font-bold text-dark-800 mb-4">
          {status === 'processing' && 'Authenticating...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h1>
        <p className={`text-lg mb-6 ${getStatusColor()}`}>
          {message}
        </p>
        {status === 'success' && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiLoader} className="animate-spin" />
            <span>Redirecting to dashboard...</span>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Back to Login
            </button>
            <p className="text-sm text-gray-500">
              Redirecting automatically in a few seconds...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AuthCallback;