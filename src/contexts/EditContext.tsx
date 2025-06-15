
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditableContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  aboutTitle: string;
  aboutDescription: string;
  product1Title: string;
  product1Description: string;
  product1Price: string;
  product2Title: string;
  product2Description: string;
  product2Price: string;
  product3Title: string;
  product3Description: string;
  product3Price: string;
  footerText: string;
}

interface EditContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  content: EditableContent;
  setIsEditMode: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
  updateContent: (key: keyof EditableContent, value: string) => void;
}

const defaultContent: EditableContent = {
  heroTitle: "AVIATOR NATION",
  heroSubtitle: "Vintage-Inspired California Lifestyle",
  heroButtonText: "SHOP NOW",
  aboutTitle: "About Aviator Nation",
  aboutDescription: "Vintage-inspired California lifestyle brand creating premium apparel with a retro aesthetic. Our designs capture the spirit of freedom and adventure.",
  product1Title: "Classic Hoodie",
  product1Description: "Soft, comfortable hoodie with vintage-inspired graphics",
  product1Price: "$140",
  product2Title: "Vintage Tee",
  product2Description: "Premium cotton t-shirt with retro Aviator Nation design",
  product2Price: "$65",
  product3Title: "Sweatpants",
  product3Description: "Comfortable sweatpants perfect for California lifestyle",
  product3Price: "$120",
  footerText: "© 2024 Aviator Nation. All rights reserved."
};

const EditContext = createContext<EditContextType | undefined>(undefined);

export const EditProvider = ({ children }: { children: ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState<EditableContent>(defaultContent);

  const updateContent = (key: keyof EditableContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <EditContext.Provider value={{
      isEditMode,
      isAuthenticated,
      content,
      setIsEditMode,
      setIsAuthenticated,
      updateContent
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
