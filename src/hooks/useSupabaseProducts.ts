import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  purchaseLink: string;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Classic Hoodie',
    description: 'Soft, comfortable hoodie with vintage-inspired graphics',
    price: '$140',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
    category: 'Áo hoodie',
    purchaseLink: 'https://example.com/hoodie'
  },
  {
    id: '2',
    title: 'Vintage Tee',
    description: 'Premium cotton t-shirt with retro Aviator Nation design',
    price: '$65',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    category: 'Áo phông',
    purchaseLink: 'https://example.com/tee'
  },
  {
    id: '3',
    title: 'Sweatpants',
    description: 'Comfortable sweatpants perfect for California lifestyle',
    price: '$120',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    category: 'Quần dài',
    purchaseLink: 'https://example.com/sweatpants'
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
        const mappedProducts: Product[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          price: item.price || '',
          image: (item.images && item.images.length > 0) ? item.images[0] : '',
          category: item.category,
          purchaseLink: item.purchase_link || item.shop_link || ''
        }));
        setProducts(mappedProducts);
      } else {
        // Seed default data if no products exist
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
      const productsToInsert = defaultProducts.map(product => ({
        title: product.title,
        description: product.description,
        category: product.category,
        images: [product.image],
        purchase_link: product.purchaseLink
      }));

      const { error } = await supabase
        .from('products')
        .insert(productsToInsert);

      if (error) {
        console.error('Error seeding products:', error);
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          category: product.category,
          images: product.image ? [product.image] : [],
          purchase_link: product.purchaseLink
        })
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
      const updateData: any = {};
      
      if (updatedProduct.title !== undefined) updateData.title = updatedProduct.title;
      if (updatedProduct.description !== undefined) updateData.description = updatedProduct.description;
      if (updatedProduct.category !== undefined) updateData.category = updatedProduct.category;
      if (updatedProduct.purchaseLink !== undefined) updateData.purchase_link = updatedProduct.purchaseLink;
      if (updatedProduct.image !== undefined) updateData.images = [updatedProduct.image];

      const { error } = await supabase
        .from('products')
        .update(updateData)
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

      // Update local state
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
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, loading };
};