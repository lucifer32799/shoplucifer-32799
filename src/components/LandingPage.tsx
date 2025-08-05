import React, { useState } from 'react';
import { useEdit } from '@/contexts/EditContext';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import ProductFilter from './ProductFilter';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import ProductManager from './ProductManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, updateProduct, deleteProduct, isEditMode, getFilteredProducts } = useEdit();
  
  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <EditableText
                contentKey="heroTitle"
                element="h1"
                className="text-2xl font-bold text-orange-600"
              />
            </div>
            {!isAuthenticated && (
              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                size="sm"
                className="ml-4 opacity-0"
              >
                Admin
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-400 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            contentKey="heroTitle"
            element="h1"
            className="text-5xl md:text-7xl font-bold mb-4"
          />
          <EditableText
            contentKey="heroSubtitle"
            element="p"
            className="text-xl md:text-2xl mb-8 opacity-90"
          />
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
            <EditableText
              contentKey="heroButtonText"
              element="span"
              className="font-semibold"
            />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <EditableText
              contentKey="aboutTitle"
              element="h2"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            />
            <EditableText
              contentKey="aboutDescription"
              element="p"
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableText
            contentKey="featuredProductsTitle"
            element="h2"
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
          />
          
          <ProductFilter />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow relative">
                {isEditMode && (
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-300 rounded-t-lg overflow-hidden">
                  <EditableImage
                    src={product.image || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop'}
                    alt={product.title}
                    onImageChange={(newSrc) => updateProduct(product.id, { image: newSrc })}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input
                        value={product.title}
                        onChange={(e) => updateProduct(product.id, { title: e.target.value })}
                        className="text-xl font-bold mb-2 w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                      <textarea
                        value={product.description}
                        onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                        className="text-gray-600 mb-2 w-full border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
                        rows={2}
                      />
                      <input
                        value={product.category}
                        onChange={(e) => updateProduct(product.id, { category: e.target.value })}
                        placeholder="Danh mục"
                        className="text-sm text-gray-500 mb-2 w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                      <input
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, { price: e.target.value })}
                        className="text-2xl font-bold text-orange-600 mb-2 w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                      <Input
                        value={product.purchaseLink}
                        onChange={(e) => updateProduct(product.id, { purchaseLink: e.target.value })}
                        placeholder="Link mua hàng"
                        className="text-sm border border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                      <p className="text-gray-600 mb-2">{product.description}</p>
                      <p className="text-sm text-gray-500 mb-4">Danh mục: {product.category}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-orange-600">{product.price}</p>
                        {product.purchaseLink && (
                          <Button
                            onClick={() => window.open(product.purchaseLink, '_blank')}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Mua ngay
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không có sản phẩm nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            contentKey="footerText"
            element="p"
            className="opacity-80"
          />
        </div>
      </footer>

      {/* Admin Components */}
      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AdminPanel />
      <ProductManager />
    </div>
  );
};

export default LandingPage;