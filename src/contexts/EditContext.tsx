
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSupabaseContent, EditableContent } from '@/hooks/useSupabaseContent';
import { useSupabaseProducts, Product } from '@/hooks/useSupabaseProducts';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export type { EditableContent, Product };

interface EditContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  content: EditableContent;
  products: Product[];
  selectedCategory: string;
  setIsEditMode: (value: boolean) => void;
  setSelectedCategory: (category: string) => void;
  updateContent: (key: keyof EditableContent, value: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getCategories: () => string[];
  getFilteredProducts: () => Product[];
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}


const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  
  // Use Supabase hooks
  const { content, updateContent, isLoading: contentLoading } = useSupabaseContent();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getCategories,
    isLoading: productsLoading 
  } = useSupabaseProducts();
  const { isAuthenticated, signIn, signOut } = useSupabaseAuth();

  const isLoading = contentLoading || productsLoading;

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
      isLoading,
      content,
      products,
      selectedCategory,
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
