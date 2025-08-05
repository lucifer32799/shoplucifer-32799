import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// @ts-ignore - Temporary fix for Supabase typing issues
const supabaseClient = supabase as any;

export interface EditableContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  aboutTitle: string;
  aboutDescription: string;
  featuredProductsTitle: string;
  footerText: string;
}

const defaultContent: EditableContent = {
  heroTitle: "AVIATOR NATION",
  heroSubtitle: "Vintage-Inspired California Lifestyle",
  heroButtonText: "SHOP NOW",
  aboutTitle: "About Aviator Nation",
  aboutDescription: "Vintage-inspired California lifestyle brand creating premium apparel with a retro aesthetic. Our designs capture the spirit of freedom and adventure.",
  featuredProductsTitle: "Featured Products",
  footerText: "© 2024 Aviator Nation. All rights reserved."
};

export const useSupabaseContent = () => {
  const [content, setContent] = useState<EditableContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from('content')
        .select('key, value');

      if (error) throw error;

      if (data && data.length > 0) {
        const contentMap: Partial<EditableContent> = {};
        data.forEach((item: any) => {
          if (item.key in defaultContent) {
            contentMap[item.key as keyof EditableContent] = item.value;
          }
        });
        setContent({ ...defaultContent, ...contentMap });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải nội dung",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (key: keyof EditableContent, value: string) => {
    try {
      const { error } = await supabaseClient
        .from('content')
        .upsert(
          { key, value },
          { onConflict: 'key' }
        );

      if (error) throw error;

      setContent(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Thành công",
        description: "Nội dung đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật nội dung",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    updateContent,
    isLoading,
    refetch: fetchContent
  };
};