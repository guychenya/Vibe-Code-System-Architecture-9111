import { useState, useEffect } from 'react';
import supabase from '../lib/supabase.js';
import toast from 'react-hot-toast';

export const useSupabase = (table, query = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase.from(table).select(query.select || '*');
      
      // Apply filters
      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryBuilder = queryBuilder.eq(key, value);
          }
        });
      }
      
      // Apply order
      if (query.orderBy) {
        queryBuilder = queryBuilder.order(query.orderBy.column, { 
          ascending: query.orderBy.ascending 
        });
      }
      
      // Apply limit
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }
      
      const { data: result, error: fetchError } = await queryBuilder;
      
      if (fetchError) throw fetchError;
      setData(result);
    } catch (err) {
      console.error(`Error fetching from ${table}:`, err);
      setError(err);
      toast.error(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time changes
  useEffect(() => {
    if (query.realtime) {
      const channel = supabase
        .channel(`${table}-changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: table
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(current => [...current, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setData(current => 
              current.map(item => item.id === payload.new.id ? payload.new : item)
            );
          } else if (payload.eventType === 'DELETE') {
            setData(current => 
              current.filter(item => item.id !== payload.old.id)
            );
          }
        })
        .subscribe();
      
      setSubscription(channel);
      
      return () => {
        if (channel) channel.unsubscribe();
      };
    }
  }, [table, query.realtime]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [JSON.stringify(query)]); // Re-fetch when query changes

  // CRUD operations
  const create = async (newData) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([newData])
        .select();
      
      if (error) throw error;
      
      if (!query.realtime) {
        setData(current => [...current, result[0]]);
      }
      
      return result[0];
    } catch (err) {
      console.error(`Error creating in ${table}:`, err);
      toast.error(`Failed to create: ${err.message}`);
      throw err;
    }
  };

  const update = async (id, updates) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!query.realtime) {
        setData(current => 
          current.map(item => item.id === id ? result[0] : item)
        );
      }
      
      return result[0];
    } catch (err) {
      console.error(`Error updating in ${table}:`, err);
      toast.error(`Failed to update: ${err.message}`);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      if (!query.realtime) {
        setData(current => current.filter(item => item.id !== id));
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      toast.error(`Failed to delete: ${err.message}`);
      throw err;
    }
  };

  const refresh = () => fetchData();

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refresh
  };
};

export default useSupabase;