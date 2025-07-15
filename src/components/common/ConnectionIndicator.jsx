import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiWifi, FiWifiOff } = FiIcons;

function ConnectionIndicator({ isConnected, size = 'sm', showText = false, className = '' }) {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm'
  };
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <motion.div 
        initial={{ scale: 0.8 }} 
        animate={{ 
          scale: isConnected ? [0.8, 1.1, 1] : 1,
          opacity: isConnected ? 1 : 0.6
        }}
        transition={{ 
          duration: 0.3,
          repeat: isConnected ? 0 : 0,
          repeatType: "reverse" 
        }}
        className={`rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'} ${sizeClasses[size]}`}
      />
      
      {showText && (
        <span className={`${textSizeClasses[size]} ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      )}
    </div>
  );
}

export default ConnectionIndicator;