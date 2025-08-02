
import React, { useState } from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditableImageProps {
  src: string;
  alt: string;
  onImageChange: (newSrc: string) => void;
  className?: string;
}

const EditableImage = ({ src, alt, onImageChange, className = '' }: EditableImageProps) => {
  const { isEditMode } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState(src);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setTempSrc(src);
    }
  };

  const handleSave = () => {
    onImageChange(tempSrc);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSrc(src);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Input
          value={tempSrc}
          onChange={(e) => setTempSrc(e.target.value)}
          placeholder="URL hình ảnh"
          className="border-2 border-blue-500"
        />
        <div className="flex space-x-2">
          <Button onClick={handleSave} size="sm">Lưu</Button>
          <Button onClick={handleCancel} variant="outline" size="sm">Hủy</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`${className} ${isEditMode ? 'cursor-pointer hover:opacity-80' : ''}`}
        onClick={handleClick}
      />
      {isEditMode && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          📷
        </div>
      )}
    </div>
  );
};

export default EditableImage;
