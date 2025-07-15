import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { OIDC_PROVIDERS } from '../../lib/oidc-config.js';

const { FiCode, FiBell, FiSearch, FiSettings, FiUser, FiLogOut, FiShield } = FiIcons;

function Navbar() {
  const { user, signOut } = useAuth();

  const getProviderBadge = (providerId) => {
    const provider = OIDC_PROVIDERS[providerId];
    if (!provider) return null;

    return (
      <div className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
        <SafeIcon icon={FiShield} className="text-gray-500" />
        <span className="text-gray-600">{provider.name}</span>
      </div>
    );
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <SafeIcon icon={FiCode} className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-dark-800">Vibe Code</span>
            </div>
            
            <div className="relative ml-8">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, versions, requirements..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <SafeIcon icon={FiBell} className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://via.placeholder.com/32'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-sm">
                <div className="font-medium text-dark-800">{user?.name || 'User'}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{user?.email || 'user@example.com'}</span>
                  {user?.provider && getProviderBadge(user.provider)}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <SafeIcon icon={FiSettings} className="text-lg" />
                </button>
                <button 
                  onClick={signOut}
                  className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <SafeIcon icon={FiLogOut} className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;