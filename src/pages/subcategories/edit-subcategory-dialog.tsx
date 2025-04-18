import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Subcategory } from '@/lib/types/category';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subcategory: Subcategory | null;
  onSubmit: (formData: FormData) => void;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  subcategory,
  onSubmit,
}: EditCategoryDialogProps) {
  if (!subcategory) return null;


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subcategory</DialogTitle>
        </DialogHeader>
        <form 
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   const formData = new FormData(e.currentTarget);
        //   onSubmit(formData);
        // }}
        onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={subcategory.name}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={subcategory.description}
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              {subcategory.image_url && (
                <img
                  src={subcategory.image_url}
                  alt={subcategory.name}
                  className="w-20 h-20 object-cover rounded mb-2"
                />
              )}
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}> {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Subcategory'
              )}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}