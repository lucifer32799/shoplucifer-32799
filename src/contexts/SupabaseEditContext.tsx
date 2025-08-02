import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseData, Product, WebsiteSettings, ContentItem } from '@/hooks/useSupabaseData';

interface EditContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  setIsEditMode: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  
  // Data
  products: Product[];
  websiteSettings: WebsiteSettings | null;
  content: Record<string, string>;
  loading: boolean;
  
  // Product management
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  bulkImportProducts: (products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]) => Promise<Product[] | null>;
  
  // Content management
  updateContent: (key: string, value: string) => Promise<void>;
  updateWebsiteSettings: (updates: Partial<WebsiteSettings>) => Promise<void>;
  
  // Filtering
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  getCategories: () => string[];
  getFilteredProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  
  // Share functionality
  generateShareLink: (type: 'product' | 'shop', productId?: string) => string;
}

const EditContext = createContext<EditContextType | undefined>(undefined);

export const SupabaseEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  
  const {
    products,
    websiteSettings,
    content,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateWebsiteSettings,
    updateContent,
    bulkImportProducts
  } = useSupabaseData();

  // Check for auto-redirect
  useEffect(() => {
    if (websiteSettings?.redirect_url && !isAuthenticated) {
      window.location.href = websiteSettings.redirect_url;
    }
  }, [websiteSettings, isAuthenticated]);

  const getCategories = (): string[] => {
    const categories = new Set(products.map(product => product.category));
    return ['Tất cả', ...Array.from(categories)];
  };

  const getFilteredProducts = (): Product[] => {
    if (selectedCategory === 'Tất cả') {
      return products.filter(p => !p.is_featured);
    }
    return products.filter(product => 
      product.category === selectedCategory && !product.is_featured
    );
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.is_featured);
  };

  const generateShareLink = (type: 'product' | 'shop', productId?: string): string => {
    const baseUrl = window.location.origin;
    if (type === 'product' && productId) {
      return `${baseUrl}/share.php?type=product&id=${productId}`;
    } else if (type === 'shop') {
      return `${baseUrl}/share.php?type=shop`;
    }
    return baseUrl;
  };

  const value: EditContextType = {
    isEditMode,
    isAuthenticated,
    setIsEditMode,
    setIsAuthenticated,
    
    products,
    websiteSettings,
    content,
    loading,
    
    addProduct,
    updateProduct,
    deleteProduct,
    bulkImportProducts,
    updateContent,
    updateWebsiteSettings,
    
    selectedCategory,
    setSelectedCategory,
    getCategories,
    getFilteredProducts,
    getFeaturedProducts,
    
    generateShareLink
  };

  return (
    <EditContext.Provider value={value}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = (): EditContextType => {
  const context = useContext(EditContext);
  if (context === undefined) {
    throw new Error('useEdit must be used within a SupabaseEditProvider');
  }
  return context;
};