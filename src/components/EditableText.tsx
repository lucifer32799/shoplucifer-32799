
import React, { useState } from 'react';
import { useEdit, EditableContent } from '@/contexts/EditContext';
import { Input } from '@/components/ui/input';

interface EditableTextProps {
  contentKey: keyof EditableContent;
  className?: string;
  element?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  multiline?: boolean;
}

const EditableText = ({ contentKey, className = '', element = 'p', multiline = false }: EditableTextProps) => {
  const { isEditMode, content, updateContent } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(content[contentKey]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setTempValue(content[contentKey]);
    }
  };

  const handleSave = () => {
    updateContent(contentKey, tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(content[contentKey]);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500 bg-white text-black p-2 rounded`}
            autoFocus
            rows={3}
          />
        ) : (
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500`}
            autoFocus
          />
        )}
      </div>
    );
  }

  const Component = element;
  
  return (
    <Component
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-blue-100 hover:bg-opacity-30 rounded p-1' : ''}`}
      onClick={handleClick}
    >
      {content[contentKey]}
      {isEditMode && (
        <span className="ml-2 text-blue-500 text-sm">✏️</span>
      )}
    </Component>
  );
};

export default EditableText;
