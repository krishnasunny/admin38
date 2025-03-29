export interface ImageValidation {
  file: File;
  error: string | null;
}

export interface ImageUploadProps {
  images: string[];
  maxImages?: number;
  onImagesChange: (images: string[]) => void;
  className?: string;
}