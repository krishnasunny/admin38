import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
}

export function ImagePreview({ url, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative w-40 h-40 group">
      <img
        src={url}
        alt="Product preview"
        className="w-full h-full object-cover rounded-lg border"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}