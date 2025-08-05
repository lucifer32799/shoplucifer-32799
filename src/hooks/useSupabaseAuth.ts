import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đăng nhập thành công",
      });

      return { user: data.user, error: null };
    } catch (error: any) {
      const errorMessage = error.message === 'Invalid login credentials' 
        ? 'Email hoặc mật khẩu không đúng'
        : 'Có lỗi xảy ra khi đăng nhập';
      
      toast({
        title: "Lỗi đăng nhập",
        description: errorMessage,
        variant: "destructive"
      });

      return { user: null, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
      });

      return { user: data.user, error: null };
    } catch (error: any) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive"
      });

      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Đăng xuất thành công",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng xuất",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };
};