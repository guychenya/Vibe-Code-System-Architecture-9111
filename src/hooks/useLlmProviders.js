import { useState, useEffect } from 'react';
import supabase from '../lib/supabase.js';
import toast from 'react-hot-toast';

export const useLlmProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
    
    // Subscribe to changes
    const channel = supabase
      .channel('llm-providers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'llm_providers_ax72p9' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProviders(current => [...current, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setProviders(current => 
              current.map(provider => 
                provider.id === payload.new.id ? payload.new : provider
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setProviders(current => 
              current.filter(provider => provider.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('llm_providers_ax72p9')
        .select('*');
        
      if (error) throw error;
      setProviders(data || []);
    } catch (err) {
      console.error('Error fetching LLM providers:', err);
      setError(err.message);
      toast.error(`Failed to load LLM providers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const connectProvider = async (id, config) => {
    try {
      const { error } = await supabase
        .from('llm_providers_ax72p9')
        .update({ 
          is_connected: true,
          ...config,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Provider connected successfully');
      return true;
    } catch (err) {
      console.error('Error connecting provider:', err);
      toast.error(`Failed to connect provider: ${err.message}`);
      return false;
    }
  };

  const disconnectProvider = async (id) => {
    try {
      const { error } = await supabase
        .from('llm_providers_ax72p9')
        .update({ 
          is_connected: false,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Provider disconnected');
      return true;
    } catch (err) {
      console.error('Error disconnecting provider:', err);
      toast.error(`Failed to disconnect provider: ${err.message}`);
      return false;
    }
  };

  return {
    providers,
    loading,
    error,
    connectProvider,
    disconnectProvider,
    refreshProviders: fetchProviders
  };
};

export default useLlmProviders;