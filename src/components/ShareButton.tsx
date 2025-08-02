import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useEdit } from '@/contexts/SupabaseEditContext';

interface ShareButtonProps {
  type: 'product' | 'shop';
  productId?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ type, productId, className }) => {
  const { generateShareLink } = useEdit();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareLink = generateShareLink(type, productId);
    
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={className}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-1" />
          Đã sao chép
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-1" />
          Chia sẻ
        </>
      )}
    </Button>
  );
};

export default ShareButton;