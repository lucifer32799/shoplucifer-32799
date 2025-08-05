import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// @ts-ignore - Temporary fix for Supabase typing issues
const supabaseClient = supabase as any;

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  purchaseLink: string;
}

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description || '',
        price: `$${product.price || '0'}`,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        category: product.category,
        purchaseLink: product.shop_link || product.purchase_link || '#'
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải sản phẩm",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const price = product.price.replace('$', '');
      const { data, error } = await supabaseClient
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          price: price,
          images: [product.image],
          category: product.category,
          shop_link: product.purchaseLink
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newProduct: Product = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          price: `$${data.price || '0'}`,
          image: data.images?.[0] || product.image,
          category: data.category,
          purchaseLink: data.shop_link || '#'
        };

        setProducts(prev => [newProduct, ...prev]);
        
        toast({
          title: "Thành công",
          description: "Sản phẩm đã được thêm",
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm",
        variant: "destructive"
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const price = updates.price?.replace('$', '');
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (price !== undefined) updateData.price = price;
      if (updates.image) updateData.images = [updates.image];
      if (updates.category) updateData.category = updates.category;
      if (updates.purchaseLink) updateData.shop_link = updates.purchaseLink;

      const { error } = await supabaseClient
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
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
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
        variant: "destructive"
      });
    }
  };

  const getCategories = () => {
    const categories = Array.from(new Set(products.map(product => product.category)));
    return ['Tất cả', ...categories];
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    isLoading,
    refetch: fetchProducts
  };
};