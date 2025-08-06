import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSupabaseContent } from '@/hooks/useSupabaseContent';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import type { EditableContent } from '@/hooks/useSupabaseContent';
import type { Product } from '@/hooks/useSupabaseProducts';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface EditContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  content: EditableContent;
  products: Product[];
  selectedCategory: string;
  loading: boolean;
  setIsEditMode: (value: boolean) => void;
  setSelectedCategory: (category: string) => void;
  updateContent: (key: keyof EditableContent, value: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getCategories: () => string[];
  getFilteredProducts: () => Product[];
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  
  // Use Supabase hooks
  const { content, updateContent, loading: contentLoading } = useSupabaseContent();
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useSupabaseProducts();
  const { isAuthenticated, signIn, signOut } = useSupabaseAuth();

  const loading = contentLoading || productsLoading;

  const getCategories = (): string[] => {
    const categories = Array.from(new Set(products.map(product => product.category)));
    return ['Tất cả', ...categories];
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'Tất cả') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  return (
    <EditContext.Provider value={{
      isEditMode,
      isAuthenticated,
      content,
      products,
      selectedCategory,
      loading,
      setIsEditMode,
      setSelectedCategory,
      updateContent,
      addProduct,
      updateProduct,
      deleteProduct,
      getCategories,
      getFilteredProducts,
      signIn,
      signOut
    }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error('useEdit must be used within an EditProvider');
  }
  return context;
};

export type { EditableContent };