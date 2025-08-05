
import React from 'react';
import { useEdit } from '@/contexts/EditContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPanel = () => {
  const { isAuthenticated, isEditMode, setIsEditMode, signOut } = useEdit();

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await signOut();
    setIsEditMode(false);
  };

  return (
    <Card className="fixed top-4 right-4 z-50 w-64">
      <CardHeader>
        <CardTitle className="text-sm">Admin Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          variant={isEditMode ? "destructive" : "default"}
          className="w-full"
        >
          {isEditMode ? 'Tắt chỉnh sửa' : 'Bật chỉnh sửa'}
        </Button>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Đăng xuất
        </Button>
        {isEditMode && (
          <p className="text-xs text-gray-600 mt-2">
            Click vào bất kỳ text nào để chỉnh sửa
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPanel;
