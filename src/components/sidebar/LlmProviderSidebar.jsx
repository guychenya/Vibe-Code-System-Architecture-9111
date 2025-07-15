import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ConnectionIndicator from '../common/ConnectionIndicator';
import useLlmProviders from '../../hooks/useLlmProviders';
import toast from 'react-hot-toast';

const {
  FiMessageSquare,
  FiServer,
  FiCloud,
  FiCloudLightning,
  FiZap,
  FiBolt,
  FiCpu,
  FiX,
  FiSettings,
  FiPlus,
  FiSave
} = FiIcons;

function LlmProviderSidebar() {
  const { providers, loading, error, connectProvider, disconnectProvider } = useLlmProviders();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [config, setConfig] = useState({
    apiKey: '',
    baseUrl: ''
  });

  const getProviderIcon = (type) => {
    switch (type) {
      case 'FiServer': return FiServer;
      case 'FiCloud': return FiCloud;
      case 'FiCloudLightning': return FiCloudLightning;
      case 'FiZap': return FiZap;
      case 'FiBolt': return FiBolt;
      case 'FiCpu': return FiCpu;
      case 'FiX': return FiX;
      default: return FiCloud;
    }
  };

  const handleOpenSettings = (provider) => {
    setSelectedProvider(provider);
    setConfig({
      apiKey: '',
      baseUrl: provider.type === 'local' ? 'http://localhost:11434' : ''
    });
    setShowSettings(true);
  };

  const handleSaveSettings = async () => {
    if (selectedProvider.type !== 'local' && !config.apiKey) {
      toast.error('API Key is required');
      return;
    }

    const updatedConfig = {
      base_url: config.baseUrl || null
    };
    
    if (selectedProvider.type !== 'local') {
      updatedConfig.api_key = config.apiKey;
    }
    
    const success = await connectProvider(selectedProvider.id, updatedConfig);
    if (success) {
      setShowSettings(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 flex items-center">
          <SafeIcon icon={FiMessageSquare} className="mr-2 text-primary-600" />
          AI Providers
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading providers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {providers.map(provider => (
            <div
              key={provider.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={getProviderIcon(provider.icon)} className="text-gray-600" />
                <span className="text-sm font-medium">{provider.name}</span>
                <ConnectionIndicator isConnected={provider.is_connected} size="xs" />
              </div>
              <div>
                {provider.is_connected ? (
                  <button
                    onClick={() => disconnectProvider(provider.id)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    title="Disconnect"
                  >
                    <SafeIcon icon={FiX} className="text-sm" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenSettings(provider)}
                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                    title="Connect"
                  >
                    <SafeIcon icon={FiSettings} className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provider Settings Modal */}
      {showSettings && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Connect to {selectedProvider.name}
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedProvider.type === 'local' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Server URL
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Make sure Ollama is running locally
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      placeholder="Enter API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1"
              >
                <SafeIcon icon={FiSave} />
                <span>Connect</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default LlmProviderSidebar;