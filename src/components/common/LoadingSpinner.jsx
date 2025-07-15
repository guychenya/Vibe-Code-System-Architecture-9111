import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLoader } = FiIcons;

function LoadingSpinner({ size = 'lg', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <SafeIcon 
          icon={FiLoader} 
          className={`${sizeClasses[size]} text-primary-600 animate-spin mx-auto mb-4`} 
        />
        <p className="text-gray-600">{message}</p>
      </motion.div>
    </div>
  );
}

export default LoadingSpinner;