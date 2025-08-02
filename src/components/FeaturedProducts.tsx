import React from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import { Button } from '@/components/ui/button';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import ShareButton from './ShareButton';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

const FeaturedProducts = () => {
  const { 
    getFeaturedProducts, 
    isEditMode, 
    updateProduct, 
    deleteProduct 
  } = useEdit();
  
  const featuredProducts = getFeaturedProducts();

  const handleImageChange = async (productId: string, imageIndex: number, newSrc: string) => {
    try {
      const product = featuredProducts.find(p => p.id === productId);
      if (product) {
        const newImages = [...product.images];
        newImages[imageIndex] = newSrc;
        await updateProduct(productId, { images: newImages });
      }
    } catch (error) {
      console.error('Error updating product image:', error);
    }
  };

  const handleProductUpdate = async (productId: string, field: string, value: string) => {
    try {
      await updateProduct(productId, { [field]: value });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <EditableText
              contentKey="featured_products_title"
              initialText="Cửa hàng nổi bật"
              as="span"
            />
          </h2>
          <p className="text-center text-gray-600">
            Chưa có sản phẩm nổi bật nào. Hãy thêm sản phẩm và đánh dấu là "nổi bật" trong admin panel.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <EditableText
            contentKey="featured_products_title"
            initialText="Cửa hàng nổi bật"
            as="span"
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image Gallery */}
              <div className="relative">
                {product.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {product.images.slice(0, 4).map((image, index) => (
                      <div key={index} className={`${index === 0 && product.images.length === 1 ? 'col-span-2' : ''}`}>
                        <EditableImage
                          src={image}
                          alt={`${product.title} - Ảnh ${index + 1}`}
                          onImageChange={(newSrc) => handleImageChange(product.id, index, newSrc)}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Chưa có hình ảnh</span>
                  </div>
                )}
                
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      onClick={() => handleDelete(product.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={product.title}
                      onChange={(e) => handleProductUpdate(product.id, 'title', e.target.value)}
                      className="text-xl font-semibold w-full border-b border-blue-300 bg-transparent"
                    />
                    <textarea
                      value={product.description}
                      onChange={(e) => handleProductUpdate(product.id, 'description', e.target.value)}
                      className="text-gray-600 w-full border border-blue-300 rounded p-2"
                      rows={3}
                    />
                    <input
                      type="text"
                      value={product.category}
                      onChange={(e) => handleProductUpdate(product.id, 'category', e.target.value)}
                      className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded border border-blue-300"
                      placeholder="Danh mục"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <span className="inline-block text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded mb-4">
                      {product.category}
                    </span>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    {product.purchase_link && (
                      <Button
                        onClick={() => window.open(product.purchase_link, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Xem sản phẩm
                      </Button>
                    )}
                    
                    {product.shop_link && (
                      <Button
                        onClick={() => window.open(product.shop_link, '_blank')}
                        variant="outline"
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Đến cửa hàng
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <ShareButton type="product" productId={product.id} className="flex-1" />
                    <ShareButton type="shop" className="flex-1" />
                  </div>
                </div>

                {isEditMode && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="url"
                      value={product.purchase_link || ''}
                      onChange={(e) => handleProductUpdate(product.id, 'purchase_link', e.target.value)}
                      placeholder="Link xem sản phẩm"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <input
                      type="url"
                      value={product.shop_link || ''}
                      onChange={(e) => handleProductUpdate(product.id, 'shop_link', e.target.value)}
                      placeholder="Link cửa hàng"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;