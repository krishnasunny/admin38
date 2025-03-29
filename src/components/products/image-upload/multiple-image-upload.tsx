import { useState } from 'react';
import { cn } from '@/lib/utils';
import { validateImage } from './image-validation';
import { ImagePreview } from './image-preview';
import { ImageDropzone } from './image-dropzone';
import type { ImageUploadProps } from './types';

export function MultipleImageUpload({
  images,
  maxImages = 5,
  onImagesChange,
  className,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setError(null);
    const validFiles = files.filter(file => !validateImage(file));
    
    const newImages = await Promise.all(
      validFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    onImagesChange([...images, ...newImages]);
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    setError(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <ImagePreview
            key={index}
            url={url}
            onRemove={() => handleRemove(index)}
          />
        ))}
        {images.length < maxImages && (
          <ImageDropzone onFileSelect={handleFileSelect} />
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}