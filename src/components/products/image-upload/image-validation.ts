const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImage(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size too large. Maximum size is 5MB.';
  }
  return null;
}