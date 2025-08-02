import React, { useState } from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const RedirectSettings = () => {
  const { websiteSettings, updateWebsiteSettings, isAuthenticated } = useEdit();
  const [redirectUrl, setRedirectUrl] = useState(websiteSettings?.redirect_url || '');
  const [isEnabled, setIsEnabled] = useState(!!websiteSettings?.redirect_url);
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWebsiteSettings({
        redirect_url: isEnabled ? redirectUrl : null
      });
    } catch (error) {
      console.error('Error saving redirect settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="fixed top-20 right-4 z-40 w-80">
      <CardHeader>
        <CardTitle className="text-sm">Cài đặt chuyển hướng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="redirect-enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
          <Label htmlFor="redirect-enabled">Bật chuyển hướng tự động</Label>
        </div>
        
        {isEnabled && (
          <div>
            <Label htmlFor="redirect-url">URL chuyển hướng</Label>
            <Input
              id="redirect-url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
        )}
        
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
        
        <p className="text-xs text-gray-600">
          Khi bật, khách truy cập sẽ được chuyển hướng tự động đến URL này
        </p>
      </CardContent>
    </Card>
  );
};

export default RedirectSettings;