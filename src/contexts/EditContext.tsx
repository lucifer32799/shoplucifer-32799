
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  purchaseLink: string;
}

export interface EditableContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  aboutTitle: string;
  aboutDescription: string;
  featuredProductsTitle: string;
  footerText: string;
}

interface EditContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  content: EditableContent;
  products: Product[];
  selectedCategory: string;
  setIsEditMode: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  setSelectedCategory: (category: string) => void;
  updateContent: (key: keyof EditableContent, value: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getCategories: () => string[];
  getFilteredProducts: () => Product[];
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

// Helper functions for localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<EditableContent>(defaultContent);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedContent = loadFromLocalStorage('editableContent', defaultContent);
    const savedProducts = loadFromLocalStorage('products', defaultProducts);
    
    setContent(savedContent);
    setProducts(savedProducts);
  }, []);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage('editableContent', content);
  }, [content]);

  // Save products to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('products', products);
  }, [products]);

  const updateContent = (key: keyof EditableContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getCategories = () => {
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
      setIsEditMode,
      setIsAuthenticated,
      setSelectedCategory,
      updateContent,
      addProduct,
      updateProduct,
      deleteProduct,
      getCategories,
      getFilteredProducts
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
