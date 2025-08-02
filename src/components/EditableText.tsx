import React, { useState } from 'react';
import { useEdit } from '@/contexts/SupabaseEditContext';
import { Input } from '@/components/ui/input';

interface EditableTextProps {
  contentKey: string;
  initialText: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  multiline?: boolean;
}

const EditableText = ({ contentKey, initialText, className = '', as = 'p', multiline = false }: EditableTextProps) => {
  const { isEditMode, updateContent, content } = useEdit();
  const currentText = content[contentKey] || initialText;
  const [text, setText] = useState(currentText);
  const [isEditing, setIsEditing] = useState(false);

  // Update local text when content changes
  React.useEffect(() => {
    setText(currentText);
  }, [currentText]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setText(currentText);
    }
  };

  const handleSave = async () => {
    try {
      await updateContent(contentKey, text);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleCancel = () => {
    setText(currentText);
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500 bg-white text-black p-2 rounded`}
            autoFocus
            rows={3}
          />
        ) : (
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500`}
            autoFocus
          />
        )}
      </div>
    );
  }

  const Component = as;
  
  return (
    <Component
      className={`${className} ${isEditMode ? 'cursor-pointer hover:bg-blue-50 rounded px-2 py-1' : ''}`}
      onClick={handleClick}
    >
      {currentText}
      {isEditMode && (
        <span className="ml-2 text-blue-500 text-sm">✏️</span>
      )}
    </Component>
  );
};

export default EditableText;