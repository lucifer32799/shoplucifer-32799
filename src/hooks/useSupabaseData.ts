import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  purchase_link?: string;
  shop_link?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteSettings {
  id: string;
  redirect_url?: string;
  site_title: string;
}

export interface ContentItem {
  key: string;
  value: string;
}

export const useSupabaseData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (productsError) throw productsError;
      
      // Fetch website settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('website_settings')
        .select('*')
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*');
      
      if (contentError) throw contentError;
      
      setProducts(productsData || []);
      setWebsiteSettings(settingsData);
      
      // Convert content array to object
      const contentObj: Record<string, string> = {};
      contentData?.forEach((item) => {
        contentObj[item.key] = item.value;
      });
      setContent(contentObj);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateWebsiteSettings = async (updates: Partial<WebsiteSettings>) => {
    try {
      if (!websiteSettings) {
        // Create new settings
        const { data, error } = await supabase
          .from('website_settings')
          .insert([updates])
          .select()
          .single();
        
        if (error) throw error;
        setWebsiteSettings(data);
      } else {
        // Update existing settings
        const { data, error } = await supabase
          .from('website_settings')
          .update(updates)
          .eq('id', websiteSettings.id)
          .select()
          .single();
        
        if (error) throw error;
        setWebsiteSettings(data);
      }
    } catch (error) {
      console.error('Error updating website settings:', error);
      throw error;
    }
  };

  const updateContent = async (key: string, value: string) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .upsert({ key, value }, { onConflict: 'key' })
        .select()
        .single();
      
      if (error) throw error;
      
      setContent(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const bulkImportProducts = async (products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();
      
      if (error) throw error;
      
      setProducts(prev => [...(data || []), ...prev]);
      return data;
    } catch (error) {
      console.error('Error bulk importing products:', error);
      throw error;
    }
  };

  return {
    products,
    websiteSettings,
    content,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateWebsiteSettings,
    updateContent,
    bulkImportProducts,
    fetchData
  };
};