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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCategoryDialogProps) {
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
          <DialogTitle>Add Subcategory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Subcategory'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}




















// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";

// interface AddCategoryDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmitSuccess?: () => void;
// }

// export function AddCategoryDialog({
//   open,
//   onOpenChange,
//   onSubmitSuccess,
// }: AddCategoryDialogProps) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     const token = localStorage.getItem("token");
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const formData = new FormData(e.currentTarget);
//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string;
//     const imageFile = formData.get("image") as File;

//     if (!imageFile) {
//       setError("Image is required");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Upload image to Google Cloud Storage
//       const imageUrl = await uploadImage(imageFile, "asf");

//       const response = await fetch("http://localhost:3000/api/categories", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           category_name: name,
//           description,
//           image_url: imageUrl,
//           parent_id: null,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add category");
//       }

//       onOpenChange(false);
//       onSubmitSuccess?.();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function uploadImage(image: File, id: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//       if (!image || !image.type.startsWith("image/")) {
//         toast.error("Please select a valid image file");
//         return reject("Invalid file");
//       }

//       const fileType = image.type.split("/")[1]; // Extract format (jpeg, png, webp, etc.)
//       const fileName = `${Date.now()}_post.${fileType}`;

//       const newFile = new File([image], fileName, { type: image.type });
//       const formData = new FormData();

//       if (!id) {
//         toast.error("Missing test ID");
//         return reject("Missing test ID");
//       }

//       formData.append("testId", id);
//       formData.append("file", newFile); // Match the backend field name

//       axios
//         .post("http://localhost:3000/api/upload-gcs", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         })
//         .then((res) => {
//           if (res.data.imageUrl) {
//             resolve(res.data.imageUrl);
//           } else {
//             reject("Upload failed");
//           }
//         })
//         .catch((err) => {
//           toast.error(`Error uploading image: ${err.message}`);
//           reject(err);
//         });
//     });
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Category</DialogTitle>
//         </DialogHeader>
//         {error && <p className="text-red-500">{error}</p>}
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" name="name" required />
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea id="description" name="description" />
//             </div>
//             <div>
//               <Label htmlFor="image">Image</Label>
//               <Input
//                 id="image"
//                 name="image"
//                 type="file"
//                 accept="image/*"
//                 required
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Adding..." : "Add Category"}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// old code
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';

// interface AddCategoryDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (formData: FormData) => void;
// }

// export function AddCategoryDialog({
//   open,
//   onOpenChange,
//   onSubmit,
// }: AddCategoryDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Category</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           const formData = new FormData(e.currentTarget);
//           onSubmit(formData);
//         }}>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" name="name" required />
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea id="description" name="description" />
//             </div>
//             <div>
//               <Label htmlFor="image">Image</Label>
//               <Input
//                 id="image"
//                 name="image"
//                 type="file"
//                 accept="image/*"
//                 required
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit">Add Category</Button>
//             </div>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
