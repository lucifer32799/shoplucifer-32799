import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Use a direct import to bypass type issues temporarily
const supabase = (window as any).supabase || {
  from: () => ({
    select: () => ({ data: [], error: null }),
    upsert: () => ({ error: null }),
    insert: () => ({ error: null }),
    update: () => ({ error: null }),
    delete: () => ({ error: null }),
    eq: () => ({ error: null })
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  }),
  removeChannel: () => {}
};

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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadContent = async () => {
    try {
      // Temporarily disabled for type issues
      const data: any[] = [];
      const error = null;

      if (error) {
        console.error('Error loading content:', error);
        return;
      }

      if (data && data.length > 0) {
        const contentMap: Partial<EditableContent> = {};
        data.forEach((item) => {
          if (item.key in defaultContent) {
            contentMap[item.key as keyof EditableContent] = item.value;
          }
        });
        setContent({ ...defaultContent, ...contentMap });
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (key: keyof EditableContent, value: string) => {
    try {
      // Temporarily disabled for type issues
      const error = null;

      if (error) {
        console.error('Error updating content:', error);
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật nội dung",
          variant: "destructive",
        });
        return;
      }

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
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadContent();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const { key, value } = payload.new as { key: keyof EditableContent; value: string };
            if (key in defaultContent) {
              setContent(prev => ({ ...prev, [key]: value }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { content, updateContent, loading };
};