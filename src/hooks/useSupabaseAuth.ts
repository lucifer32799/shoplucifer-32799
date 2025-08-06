import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Lỗi đăng nhập",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Thành công",
        description: "Đăng nhập thành công",
      });
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng nhập",
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Lỗi",
          description: "Không thể đăng xuất",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Thành công",
        description: "Đã đăng xuất",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng xuất",
        variant: "destructive",
      });
    }
  };

  return { isAuthenticated, setIsAuthenticated, loading, signIn, signOut };
};