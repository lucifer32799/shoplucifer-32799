import React, { useState } from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Filter, Upload } from 'lucide-react';
import BulkImport from './BulkImport';

const ProductManager = () => {
  const { isEditMode, products, addProduct } = useEdit();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    images: [''],
    purchase_link: '',
    shop_link: '',
    is_featured: false
  });

  if (!isEditMode) return null;

  const handleAddProduct = async () => {
    if (newProduct.title && newProduct.description && newProduct.category) {
      try {
        const productData = {
          ...newProduct,
          images: newProduct.images.filter(img => img.trim() !== '')
        };
        await addProduct(productData);
        setNewProduct({ 
          title: '', 
          description: '', 
          category: '', 
          images: [''], 
          purchase_link: '', 
          shop_link: '', 
          is_featured: false 
        });
        setShowAddDialog(false);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
      <Button
        onClick={() => setShowFilterDialog(true)}
        size="sm"
        variant="outline"
        className="bg-white"
      >
        <Filter className="w-4 h-4 mr-1" />
        Lọc ({products.length})
      </Button>
      
      <Button
        onClick={() => setShowBulkImport(true)}
        size="sm"
        variant="outline"
        className="bg-white"
      >
        <Upload className="w-4 h-4 mr-1" />
        Nhập Excel
      </Button>
      
      <Button
        onClick={() => setShowAddDialog(true)}
        size="sm"
        className="bg-green-500 hover:bg-green-600"
      >
        <Plus className="w-4 h-4 mr-1" />
        Thêm sản phẩm
      </Button>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="title">Tên sản phẩm</Label>
              <Input
                id="title"
                value={newProduct.title}
                onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>
            <div>
              <Label htmlFor="featured">Sản phẩm nổi bật</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newProduct.is_featured}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <label htmlFor="featured" className="text-sm">Hiển thị trong mục nổi bật</label>
              </div>
            </div>
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Input
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                placeholder="VD: Áo phông, Quần dài, Váy..."
              />
            </div>
            <div>
              <Label>Hình ảnh</Label>
              {newProduct.images.map((image, index) => (
                <div key={index} className="flex space-x-2 mt-1">
                  <Input
                    value={image}
                    onChange={(e) => {
                      const newImages = [...newProduct.images];
                      newImages[index] = e.target.value;
                      setNewProduct(prev => ({ ...prev, images: newImages }));
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  {index === newProduct.images.length - 1 && (
                    <Button
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, images: [...prev.images, ''] }))}
                      size="sm"
                    >
                      +
                    </Button>
                  )}
                  {newProduct.images.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => {
                        const newImages = newProduct.images.filter((_, i) => i !== index);
                        setNewProduct(prev => ({ ...prev, images: newImages }));
                      }}
                      variant="outline"
                      size="sm"
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="purchaseLink">Link mua hàng</Label>
              <Input
                id="purchaseLink"
                value={newProduct.purchase_link}
                onChange={(e) => setNewProduct(prev => ({ ...prev, purchase_link: e.target.value }))}
                placeholder="https://example.com/buy"
              />
            </div>
            <div>
              <Label htmlFor="shopLink">Link cửa hàng</Label>
              <Input
                id="shopLink"
                value={newProduct.shop_link}
                onChange={(e) => setNewProduct(prev => ({ ...prev, shop_link: e.target.value }))}
                placeholder="https://example.com/shop"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddProduct} className="flex-1">
                Thêm sản phẩm
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quản lý sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <p>Hiện có {products.length} sản phẩm</p>
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">{product.title}</span>
                    <span className="text-sm text-gray-500 ml-2">({product.category})</span>
                    {product.is_featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">
                        Nổi bật
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{product.images.length} ảnh</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowFilterDialog(false)} className="w-full">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BulkImport isOpen={showBulkImport} onClose={() => setShowBulkImport(false)} />
    </div>
  );
};

export default ProductManager;