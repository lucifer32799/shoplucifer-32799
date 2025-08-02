import React, { useState } from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import ProductFilter from './ProductFilter';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import ProductManager from './ProductManager';
import FeaturedProducts from './FeaturedProducts';
import RedirectSettings from './RedirectSettings';
import ShareButton from './ShareButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const { 
    isAuthenticated, 
    content, 
    updateProduct, 
    deleteProduct, 
    getFilteredProducts,
    loading,
    isEditMode
  } = useEdit();
  
  const [showLogin, setShowLogin] = useState(false);
  const filteredProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <EditableText
                contentKey="hero_title"
                initialText="My Website"
                as="h1"
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
      <section className="bg-gradient-to-r from-orange-400 to-pink-400 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <EditableText
            contentKey="hero_title"
            initialText="Chào mừng đến với website của chúng tôi"
            as="h1"
            className="text-5xl font-bold mb-6"
          />
          <EditableText
            contentKey="hero_subtitle"
            initialText="Khám phá những sản phẩm tuyệt vời"
            as="p"
            className="text-xl mb-8 opacity-90"
          />
          <EditableText
            contentKey="hero_button"
            initialText="Khám phá ngay"
            as="span"
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors cursor-pointer inline-block"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <EditableText
            contentKey="about_title"
            initialText="Về chúng tôi"
            as="h2"
            className="text-3xl font-bold mb-6 text-gray-800"
          />
          <EditableText
            contentKey="about_description"
            initialText="Chúng tôi là một công ty chuyên cung cấp những sản phẩm chất lượng cao"
            as="p"
            className="text-lg text-gray-600 leading-relaxed"
            multiline
          />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <EditableText
            contentKey="products_title"
            initialText="Sản phẩm nổi bật"
            as="h2"
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          />
          
          <ProductFilter />
          
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-600">Không tìm thấy sản phẩm nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-300 rounded-t-lg overflow-hidden">
                    <EditableImage
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.title}
                      onImageChange={(newSrc) => {
                        const newImages = [...product.images];
                        newImages[0] = newSrc;
                        updateProduct(product.id, { images: newImages });
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <span className="text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded">{product.category}</span>

                    <div className="mt-4 space-y-2">
                      <Button 
                        onClick={() => {
                          const featuredSection = document.getElementById('featured-products');
                          featuredSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full"
                      >
                        Xem sản phẩm
                      </Button>
                      <div className="flex space-x-2">
                        <ShareButton type="product" productId={product.id} className="flex-1" />
                        <ShareButton type="shop" className="flex-1" />
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="mt-4 space-y-2">
                        <input
                          type="text"
                          value={product.title}
                          onChange={(e) => updateProduct(product.id, { title: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        <textarea
                          value={product.description || ''}
                          onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          rows={2}
                        />
                        <input
                          type="text"
                          value={product.category}
                          onChange={(e) => updateProduct(product.id, { category: e.target.value })}
                          placeholder="Danh mục"
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        <Button
                          onClick={() => deleteProduct(product.id)}
                          variant="destructive"
                          className="w-full"
                        >
                          Xóa sản phẩm
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <div id="featured-products">
          <FeaturedProducts />
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-4xl mx-auto text-center px-4">
            <EditableText
              contentKey="footer_text"
              initialText="© 2024 My Website. Tất cả quyền được bảo lưu."
              as="p"
              className="text-gray-300"
            />
          </div>
        </footer>

        <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
        <AdminPanel />
        <ProductManager />
        <RedirectSettings />
      </div>
    </div>
  );
};

export default LandingPage;