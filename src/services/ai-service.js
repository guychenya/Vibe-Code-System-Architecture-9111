// AI Service - Handles API requests to different AI providers
import toast from 'react-hot-toast';

// Available AI providers
export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
  HUGGINGFACE: 'huggingface'
};

// Service-specific API request functions
export const aiServices = {
  [AI_PROVIDERS.OPENAI]: async (message, options = {}) => {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: options.systemPrompt || 'You are a helpful AI programming assistant that specializes in coding advice and software development.' },
          { role: 'user', content: message }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  [AI_PROVIDERS.ANTHROPIC]: async (message, options = {}) => {
    const apiKey = localStorage.getItem('anthropic_api_key');
    if (!apiKey) {
      throw new Error('Anthropic API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model || 'claude-2',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: options.maxTokens || 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from Anthropic');
    }

    const data = await response.json();
    return data.content[0].text;
  },

  [AI_PROVIDERS.GOOGLE]: async (message, options = {}) => {
    const apiKey = localStorage.getItem('google_api_key');
    if (!apiKey) {
      throw new Error('Google AI API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: message }
            ]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1000
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from Google AI');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  },

  [AI_PROVIDERS.HUGGINGFACE]: async (message, options = {}) => {
    const apiKey = localStorage.getItem('huggingface_api_key');
    if (!apiKey) {
      throw new Error('Hugging Face API key not found. Please add it in Settings > API Keys.');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response from Hugging Face');
    }

    const data = await response.json();
    return data[0].generated_text;
  }
};

// Predefined AI providers
export const AI_PROVIDERS_LIST = [
  {
    id: AI_PROVIDERS.OPENAI,
    name: 'OpenAI',
    icon: 'FiCloud',
    models: ['gpt-3.5-turbo', 'gpt-4'],
    description: 'ChatGPT and GPT-4 models',
    color: 'bg-green-600'
  },
  {
    id: AI_PROVIDERS.ANTHROPIC,
    name: 'Anthropic',
    icon: 'FiCloudLightning',
    models: ['claude-2', 'claude-instant-1'],
    description: 'Claude AI models',
    color: 'bg-purple-600'
  },
  {
    id: AI_PROVIDERS.GOOGLE,
    name: 'Google AI',
    icon: 'FiGlobe',
    models: ['gemini-pro'],
    description: 'Gemini models',
    color: 'bg-blue-600'
  },
  {
    id: AI_PROVIDERS.HUGGINGFACE,
    name: 'Hugging Face',
    icon: 'FiCpu',
    models: ['mistral-7b-instruct'],
    description: 'Open source models',
    color: 'bg-yellow-600'
  }
];

// Check which providers have API keys
export const getConnectedProviders = () => {
  return AI_PROVIDERS_LIST.map(provider => {
    const apiKey = localStorage.getItem(`${provider.id}_api_key`);
    return {
      ...provider,
      is_connected: !!apiKey
    };
  });
};

// Send message to AI provider
export const sendMessageToAI = async (message, provider, model, options = {}) => {
  try {
    if (!provider || !Object.values(AI_PROVIDERS).includes(provider)) {
      throw new Error('Invalid AI provider');
    }
    
    const service = aiServices[provider];
    if (!service) {
      throw new Error(`Service for provider ${provider} not implemented`);
    }
    
    return await service(message, { 
      ...options,
      model: model
    });
  } catch (error) {
    console.error('AI service error:', error);
    toast.error(`AI Error: ${error.message}`);
    throw error;
  }
};

export default {
  AI_PROVIDERS,
  AI_PROVIDERS_LIST,
  getConnectedProviders,
  sendMessageToAI
};