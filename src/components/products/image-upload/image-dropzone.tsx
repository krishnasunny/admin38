import { Upload } from 'lucide-react';

interface ImageDropzoneProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageDropzone({ onFileSelect }: ImageDropzoneProps) {
  return (
    <div className="w-40 h-40 border-2 border-dashed rounded-lg flex items-center justify-center">
      <label className="cursor-pointer text-center p-4">
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileSelect}
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
  );
}