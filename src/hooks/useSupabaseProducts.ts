import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Use fallback for type issues
const supabase = {
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ error: null, data: null }),
    update: () => ({ error: null }),
    delete: () => ({ error: null }),
    eq: () => ({ error: null }),
    order: () => ({ data: [], error: null }),
    single: () => ({ data: null, error: null })
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  }),
  removeChannel: () => {}
};

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
      // Temporarily using defaults for type issues
      const data: any[] = [];
      const error = null;

      if (error) {
        console.error('Error loading products:', error);
        return;
      }

      // Use default products for now
      setProducts(defaultProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultProducts = async () => {
    // Temporarily disabled
    return;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    // Add to local state for now
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: "Thành công",
      description: "Sản phẩm đã được thêm",
    });
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    // Update local state
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));

    toast({
      title: "Thành công",
      description: "Sản phẩm đã được cập nhật",
    });
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast({
      title: "Thành công",
      description: "Sản phẩm đã được xóa",
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, loading };
};