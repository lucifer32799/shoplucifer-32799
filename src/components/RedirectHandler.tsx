import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// @ts-ignore - Temporary fix for Supabase typing issues
const supabaseClient = supabase as any;

const RedirectHandler = () => {
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const { data: settings } = await supabaseClient
          .from('website_settings')
          .select('redirect_url')
          .single();

        if (settings?.redirect_url && settings.redirect_url.trim()) {
          // Add a small delay to allow the page to load
          setTimeout(() => {
            window.location.href = settings.redirect_url;
          }, 1000);
        }
      } catch (error) {
        console.log('No redirect configured');
      }
    };

    checkRedirect();
  }, []);

  return null;
};

export default RedirectHandler;