import React, { useState } from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Product } from '@/hooks/useSupabaseData';

interface BulkImportProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImport: React.FC<BulkImportProps> = ({ isOpen, onClose }) => {
  const { bulkImportProducts } = useEdit();
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Sản phẩm mẫu',
        description: 'Mô tả sản phẩm',
        category: 'Danh mục',
        images: 'https://example.com/image1.jpg,https://example.com/image2.jpg',
        purchase_link: 'https://example.com/buy',
        shop_link: 'https://example.com/shop',
        is_featured: false
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'product_template.xlsx');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[] = jsonData.map((row: any) => ({
        title: row.title || '',
        description: row.description || '',
        category: row.category || '',
        images: row.images ? row.images.split(',').map((img: string) => img.trim()) : [],
        purchase_link: row.purchase_link || '',
        shop_link: row.shop_link || '',
        is_featured: Boolean(row.is_featured)
      }));

      await bulkImportProducts(products);
      
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Error importing products:', error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập sản phẩm hàng loạt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tải xuống template Excel</Label>
            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full mt-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải template mẫu
            </Button>
          </div>
          
          <div>
            <Label htmlFor="excel-file">Chọn file Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Đang nhập...' : 'Nhập dữ liệu'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
          
          <p className="text-xs text-gray-600">
            Hỗ trợ file .xlsx và .xls. Vui lòng sử dụng template để đảm bảo định dạng đúng.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImport;