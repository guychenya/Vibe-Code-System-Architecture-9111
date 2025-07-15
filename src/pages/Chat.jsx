import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ConnectionIndicator from '../components/common/ConnectionIndicator';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import useSupabase from '../hooks/useSupabase';

const {
  FiMessageCircle,
  FiSend,
  FiPaperclip,
  FiImage,
  FiFile,
  FiUsers,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiServer,
  FiCloud,
  FiCloudLightning,
  FiZap,
  FiBolt,
  FiCpu,
  FiX,
  FiSettings,
  FiCheck,
  FiLightbulb
} = FiIcons;

function Chat() {
  const { projects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || '');
  const [message, setMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [providerConfig, setProviderConfig] = useState({
    apiKey: '',
    baseUrl: '',
    models: []
  });
  
  // Fetch LLM providers from Supabase
  const { 
    data: providers,
    loading: loadingProviders,
    update: updateProvider
  } = useSupabase('llm_providers_ax72p9', {
    select: '*',
    realtime: true
  });

  // Simulated messages for demo
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      message: 'Hey team, I just pushed the latest version with the payment integration. Can someone review it?',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'text'
    },
    {
      id: '2',
      sender: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e1e3e3?w=40&h=40&fit=crop&crop=face',
      message: 'Great work! I\'ll review it this afternoon. Also, I\'ve attached the updated wireframes.',
      timestamp: new Date('2024-01-15T10:35:00'),
      type: 'text',
      attachment: {
        name: 'wireframes_v2.pdf',
        type: 'pdf',
        size: '2.3 MB'
      }
    },
    {
      id: '3',
      sender: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      message: 'The payment flow looks good, but I noticed a small issue with the error handling. I\'ll create a ticket for it.',
      timestamp: new Date('2024-01-15T11:00:00'),
      type: 'text'
    },
    {
      id: '4',
      sender: 'Alice Brown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      message: 'Here\'s the mockup for the new dashboard design',
      timestamp: new Date('2024-01-15T11:15:00'),
      type: 'image',
      attachment: {
        name: 'dashboard_mockup.png',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      }
    }
  ]);

  const currentUser = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: currentUser.name,
      avatar: currentUser.avatar,
      message: message,
      timestamp: new Date(),
      type: 'text',
      provider: selectedProvider
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    toast.success('Message sent!');

    // Simulate AI response if provider is selected
    if (selectedProvider) {
      setTimeout(() => {
        const aiProvider = providers.find(p => p.id === selectedProvider);
        
        const aiMessage = {
          id: Date.now().toString() + '-ai',
          sender: aiProvider.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(aiProvider.name)}&background=0ea5e9&color=fff`,
          message: `This is a simulated response from ${aiProvider.name}. In a real implementation, this would come from the actual AI provider's API.`,
          timestamp: new Date(),
          type: 'text',
          isAI: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConnectProvider = async (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    
    if (provider.type === 'local' && provider.name === 'Ollama') {
      // Simulate connecting to local Ollama
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            updateProvider(providerId, { 
              is_connected: true,
              base_url: providerConfig.baseUrl || 'http://localhost:11434'
            });
            resolve();
          }, 1500);
        }),
        {
          loading: 'Connecting to Ollama...',
          success: 'Successfully connected to Ollama',
          error: 'Failed to connect to Ollama'
        }
      );
    } else {
      // For remote providers, check API key
      if (!providerConfig.apiKey) {
        toast.error('API Key is required');
        return;
      }
      
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            updateProvider(providerId, { 
              is_connected: true,
              api_key: '••••••••' + providerConfig.apiKey.slice(-4) // Store masked version for UI
            });
            resolve();
          }, 1500);
        }),
        {
          loading: `Connecting to ${provider.name}...`,
          success: `Successfully connected to ${provider.name}`,
          error: `Failed to connect to ${provider.name}`
        }
      );
    }
    
    setShowProviderSettings(false);
    setProviderConfig({ apiKey: '', baseUrl: '', models: [] });
  };

  const handleDisconnectProvider = async (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          updateProvider(providerId, { is_connected: false });
          if (selectedProvider === providerId) {
            setSelectedProvider(null);
          }
          resolve();
        }, 800);
      }),
      {
        loading: `Disconnecting from ${provider.name}...`,
        success: `Disconnected from ${provider.name}`,
        error: `Failed to disconnect from ${provider.name}`
      }
    );
  };

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

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="p-6 h-[calc(100vh-6rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <SafeIcon icon={FiMessageCircle} className="text-primary-600 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-dark-800">AI Chat Assistant</h1>
                <p className="text-gray-600">Collaborate with your team and AI assistants</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="text-gray-400" />
                <span className="text-sm text-gray-600">{selectedProjectData?.team?.length || 0} members</span>
              </div>
            </div>
          </div>

          {/* LLM Provider Selection */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">AI Assistants</h3>
              {selectedProvider && (
                <button 
                  onClick={() => setSelectedProvider(null)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {providers?.map(provider => (
                <div 
                  key={provider.id}
                  onClick={() => provider.is_connected ? setSelectedProvider(provider.id === selectedProvider ? null : provider.id) : setShowProviderSettings(provider.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    provider.id === selectedProvider 
                      ? 'bg-primary-100 text-primary-700' 
                      : provider.is_connected 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <SafeIcon icon={getProviderIcon(provider.icon)} className="text-sm" />
                  <span className="text-sm whitespace-nowrap">{provider.name}</span>
                  <ConnectionIndicator isConnected={provider.is_connected} size="xs" />
                  {provider.is_connected ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnectProvider(provider.id);
                      }}
                      className="ml-1 text-xs text-gray-500 hover:text-red-500"
                    >
                      <SafeIcon icon={FiX} className="text-xs" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProviderSettings(provider.id);
                      }}
                      className="ml-1 text-xs text-gray-500 hover:text-primary-500"
                    >
                      <SafeIcon icon={FiSettings} className="text-xs" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 ${msg.sender === currentUser.name ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className={`flex-1 max-w-md ${msg.sender === currentUser.name ? 'text-right' : ''}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{msg.sender}</span>
                  <span className="text-xs text-gray-500">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                  {msg.isAI && <SafeIcon icon={FiLightbulb} className="text-xs text-green-500" />}
                </div>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.sender === currentUser.name
                      ? 'bg-primary-600 text-white'
                      : msg.isAI
                      ? 'bg-green-50 border border-green-200 text-gray-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  {msg.attachment && (
                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded border border-white border-opacity-30">
                      {msg.attachment.type === 'image' ? (
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiFile} className="text-sm" />
                          <div>
                            <div className="text-xs font-medium">{msg.attachment.name}</div>
                            <div className="text-xs opacity-75">{msg.attachment.size}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedProvider 
                    ? `Ask ${providers.find(p => p.id === selectedProvider)?.name} something...` 
                    : "Type your message..."
                  }
                  rows="2"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiPaperclip} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiImage} />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSend} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>
              {selectedProvider ? (
                <div className="flex items-center space-x-1">
                  <span>Using:</span>
                  <span className="font-medium text-primary-600">
                    {providers.find(p => p.id === selectedProvider)?.name}
                  </span>
                  <ConnectionIndicator isConnected={true} size="xs" />
                </div>
              ) : (
                'Select an AI provider to enable AI assistance'
              )}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Provider Settings Modal */}
      {showProviderSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-800">
                Connect to {providers.find(p => p.id === showProviderSettings)?.name}
              </h2>
              <button
                onClick={() => setShowProviderSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>

            <div className="space-y-4">
              {providers.find(p => p.id === showProviderSettings)?.name === 'Ollama' ? (
                // Ollama local setup
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ollama Server URL
                    </label>
                    <input
                      type="text"
                      value={providerConfig.baseUrl}
                      onChange={(e) => setProviderConfig({ ...providerConfig, baseUrl: e.target.value })}
                      placeholder="http://localhost:11434"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Make sure Ollama is running on your local machine
                    </p>
                  </div>
                </>
              ) : (
                // Remote API providers
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={providerConfig.apiKey}
                      onChange={(e) => setProviderConfig({ ...providerConfig, apiKey: e.target.value })}
                      placeholder={`Enter your ${providers.find(p => p.id === showProviderSettings)?.name} API key`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Base URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={providerConfig.baseUrl}
                      onChange={(e) => setProviderConfig({ ...providerConfig, baseUrl: e.target.value })}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProviderSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConnectProvider(showProviderSettings)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Connect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Chat;