
import React, { useState } from 'react';
import { useEdit } from '@/contexts/EditContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Filter } from 'lucide-react';

const ProductManager = () => {
  const { isEditMode, products, addProduct } = useEdit();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  if (!isEditMode) return null;

  const handleAddProduct = () => {
    if (newProduct.title && newProduct.description && newProduct.price) {
      addProduct(newProduct);
      setNewProduct({ title: '', description: '', price: '', image: '' });
      setShowAddDialog(false);
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
          <div className="space-y-4">
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
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                value={newProduct.price}
                onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                placeholder="VD: $100"
              />
            </div>
            <div>
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={newProduct.image}
                onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
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
            <DialogTitle>Lọc sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Hiện có {products.length} sản phẩm</p>
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{product.title}</span>
                  <span className="text-green-600">{product.price}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowFilterDialog(false)} className="w-full">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;
