import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  category: string;
  purchase_link: string | null;
  shop_link: string | null;
  is_featured: boolean | null;
}

const defaultProducts: Product[] = [
  {
    id: crypto.randomUUID(),
    title: 'Classic Hoodie',
    description: 'Soft, comfortable hoodie with vintage-inspired graphics',
    images: ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop'],
    category: 'Áo hoodie',
    purchase_link: 'https://example.com/hoodie',
    shop_link: null,
    is_featured: true
  },
  {
    id: crypto.randomUUID(),
    title: 'Vintage Tee',
    description: 'Premium cotton t-shirt with retro Aviator Nation design',
    images: ['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop'],
    category: 'Áo phông',
    purchase_link: 'https://example.com/tee',
    shop_link: null,
    is_featured: true
  },
  {
    id: crypto.randomUUID(),
    title: 'Sweatpants',
    description: 'Comfortable sweatpants perfect for California lifestyle',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'],
    category: 'Quần dài',
    purchase_link: 'https://example.com/sweatpants',
    shop_link: null,
    is_featured: true
  }
];

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading products:', error);
        return;
      }

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // No products found, seed with defaults
        await seedDefaultProducts();
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultProducts = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .insert(defaultProducts);

      if (error) {
        console.error('Error seeding products:', error);
        return;
      }

      setProducts(defaultProducts);
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        toast({
          title: "Lỗi",
          description: "Không thể thêm sản phẩm",
          variant: "destructive",
        });
        return;
      }

      setProducts(prev => [...prev, data]);
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được thêm",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật sản phẩm",
          variant: "destructive",
        });
        return;
      }

      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updatedProduct } : product
      ));
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sản phẩm",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa sản phẩm",
          variant: "destructive",
        });
        return;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadProducts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('product-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, payload.new as Product]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(product => 
              product.id === payload.new.id ? payload.new as Product : product
            ));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(product => product.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, loading };
};