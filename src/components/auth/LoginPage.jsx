import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { OIDC_PROVIDERS } from '../../lib/oidc-config.js';

const { FiCode, FiShield, FiUsers, FiGithub, FiGlobe, FiLoader } = FiIcons;

function LoginPage() {
  const { signIn, isLoading, error, getAvailableProviders } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleProviderLogin = async (providerId) => {
    setSelectedProvider(providerId);
    await signIn(providerId);
  };

  const getProviderIcon = (providerId) => {
    switch (providerId) {
      case 'github':
        return FiGithub;
      case 'netlify':
        return FiGlobe;
      default:
        return FiUsers;
    }
  };

  const features = [
    {
      icon: FiCode,
      title: 'Code Version Management',
      description: 'Track and manage your code versions with full history and rollback capabilities'
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Real-time chat, file sharing, and seamless team communication'
    },
    {
      icon: FiShield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with OIDC and OAuth2 protocols'
    }
  ];

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
            {features.map((feature, index) => (
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

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-dark-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiShield} className="text-red-600" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {getAvailableProviders().map((provider) => (
              <motion.button
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProviderLogin(provider.id)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  provider.id === 'github'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading && selectedProvider === provider.id ? (
                  <SafeIcon icon={FiLoader} className="animate-spin" />
                ) : (
                  <SafeIcon icon={getProviderIcon(provider.id)} />
                )}
                <span>
                  {isLoading && selectedProvider === provider.id
                    ? 'Connecting...'
                    : `Continue with ${provider.name}`
                  }
                </span>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>🔒 Secure Authentication</span>
                <span>•</span>
                <span>🛡️ OIDC Protected</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;