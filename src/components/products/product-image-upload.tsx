import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImageUploadProps {
  initialImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  className?: string;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProductImageUpload({
  initialImage,
  onImageUpload,
  onImageRemove,
  className,
}: ProductImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size too large. Maximum size is 5MB.';
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreview(imageUrl);
      onImageUpload(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError(null);
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {preview ? (
        <div className="relative w-40 h-40">
          <img
            src={preview}
            alt="Product preview"
            className="w-full h-full object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center">
          <label className="cursor-pointer text-center p-4">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
            />
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <span className="text-sm text-muted-foreground block">
                Upload image
              </span>
              <span className="text-xs text-muted-foreground block">
                JPEG, PNG or WebP (max 5MB)
              </span>
            </div>
          </label>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}