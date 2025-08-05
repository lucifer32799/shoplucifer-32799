import React, { useState } from 'react';
import { useEdit } from '@/contexts/EditContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const BulkImport = () => {
  const [csvData, setCsvData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addProduct } = useEdit();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập dữ liệu CSV",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      if (!headers.includes('title') || !headers.includes('category')) {
        toast({
          title: "Lỗi định dạng",
          description: "CSV phải có ít nhất cột 'title' và 'category'",
          variant: "destructive"
        });
        return;
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const product: any = {};
        
        headers.forEach((header, index) => {
          product[header] = values[index] || '';
        });

        if (product.title && product.category) {
          await addProduct({
            title: product.title,
            description: product.description || '',
            price: product.price || '$0',
            image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
            category: product.category,
            purchaseLink: product.purchaseLink || '#'
          });
        }
      }

      toast({
        title: "Thành công",
        description: `Đã import ${lines.length - 1} sản phẩm`,
      });
      setCsvData('');
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi import dữ liệu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Import hàng loạt sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Định dạng CSV: title,description,price,image,category,purchaseLink
          </p>
          <Textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="title,description,price,image,category,purchaseLink
Áo thun basic,Áo thun cotton cao cấp,$25,https://example.com/image.jpg,Áo phông,https://shop.com/product1
Quần jeans,Quần jeans denim,$45,https://example.com/image2.jpg,Quần dài,https://shop.com/product2"
            className="min-h-32"
          />
        </div>
        <Button 
          onClick={handleImport} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Đang import...' : 'Import sản phẩm'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkImport;