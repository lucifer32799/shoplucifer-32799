
import React, { useState } from 'react';
import { useEdit } from '@/contexts/EditContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLogin = ({ isOpen, onClose }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, setIsEditMode } = useEdit();

  const handleLogin = () => {
    // Mật khẩu đơn giản cho demo - trong thực tế nên sử dụng hệ thống authentication phức tạp hơn
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setIsEditMode(true);
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Mật khẩu không đúng');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đăng nhập Admin</DialogTitle>
          <DialogDescription>
            Nhập mật khẩu để chỉnh sửa nội dung trang web
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập mật khẩu admin"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleLogin} className="flex-1">
              Đăng nhập
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
