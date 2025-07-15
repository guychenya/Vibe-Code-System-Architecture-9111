import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase.js';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (providerId, email = null, password = null) => {
    setIsLoading(true);
    setError(null);

    try {
      if (providerId === 'email' && email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        toast.success('Successfully signed in!');
        return data;
      } else if (providerId === 'github') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback/github`
          }
        });

        if (error) throw error;
        return data;
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.name || '',
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata.name || email)}&background=0ea5e9&color=fff`
          }
        }
      });

      if (error) throw error;
      toast.success('Successfully signed up! Please check your email for verification.');
      return data;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success('Successfully signed out!');
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut
  };
};