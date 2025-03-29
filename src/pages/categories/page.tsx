import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTable } from './category-table';
import { AddCategoryDialog } from './add-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { AddSubcategoryDialog } from './add-subcategory-dialog';
import { Category } from '@/lib/types/category';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function uploadImage(image: File, id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!image || !image.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return reject("Invalid file");
      }

      const fileType = image.type.split("/")[1];
      const fileName = `${Date.now()}_post.${fileType}`;
      const newFile = new File([image], fileName, { type: image.type });
      const formData = new FormData();

      if (!id) {
        toast({
          title: "Error",
          description: "Missing test ID",
          variant: "destructive",
        });
        return reject("Missing test ID");
      }

      formData.append("testId", id);
      formData.append("file", newFile);

      axios
        .post("http://localhost:3000/api/upload-gcs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.imageUrl) {
            resolve(res.data.imageUrl);
          } else {
            reject("Upload failed");
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: `Error uploading image: ${err.message}`,
            variant: "destructive",
          });
          reject(err);
        });
    });
  }

  const handleAddCategory = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      toast({
        title: "Error",
        description: "Image is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const imageUrl = await uploadImage(imageFile, "asf");

      const response = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_name: name,
          description,
          image_url: imageUrl,
          parent_id: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      setIsAddOpen(false);
      fetchCategories(); // Refresh the categories list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async (formData: FormData) => {
    if (!selectedCategory) return;

    try {
      // In a real app, you would make an API call here
      const updatedCategory: Category = {
        ...selectedCategory,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        imageUrl: formData.get('image') 
          ? URL.createObjectURL(formData.get('image') as File)
          : selectedCategory.imageUrl,
        updatedAt: new Date().toISOString(),
      };

      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? updatedCategory : cat
      ));
      setIsEditOpen(false);
      setSelectedCategory(null);
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      // In a real app, you would make an API call here
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const handleAddSubcategory = async (formData: FormData) => {
    if (!selectedCategory) return;

    try {
      // In a real app, you would make an API call here
      const newSubcategory = {
        id: Math.random().toString(),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        imageUrl: URL.createObjectURL(formData.get('image') as File),
        categoryId: selectedCategory.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedCategory = {
        ...selectedCategory,
        subcategories: [...selectedCategory.subcategories, newSubcategory],
      };

      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? updatedCategory : cat
      ));
      setIsAddSubcategoryOpen(false);
      toast({
        title: 'Success',
        description: 'Subcategory added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add subcategory',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and subcategories
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryTable
        categories={categories}
        onEdit={(category) => {
          setSelectedCategory(category);
          setIsEditOpen(true);
        }}
        onDelete={(category) => {
          setSelectedCategory(category);
          setIsDeleteOpen(true);
        }}
        onAddSubcategory={(category) => {
          setSelectedCategory(category);
          setIsAddSubcategoryOpen(true);
        }}
      />

      <AddCategoryDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddCategory}
      />

      <EditCategoryDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        category={selectedCategory}
        onSubmit={handleEditCategory}
      />

      <DeleteCategoryDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        category={selectedCategory}
        onConfirm={handleDeleteCategory}
      />

      <AddSubcategoryDialog
        open={isAddSubcategoryOpen}
        onOpenChange={setIsAddSubcategoryOpen}
        category={selectedCategory}
        onSubmit={handleAddSubcategory}
      />
    </div>
  );
}



















// import { useState } from 'react';
// import { Plus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { CategoryTable } from './category-table';
// import { AddCategoryDialog } from './add-category-dialog';
// import { EditCategoryDialog } from './edit-category-dialog';
// import { DeleteCategoryDialog } from './delete-category-dialog';
// import { AddSubcategoryDialog } from './add-subcategory-dialog';
// import { Category } from '@/lib/types/category';
// import { useToast } from '@/hooks/use-toast';

// // Mock data - replace with actual API integration
// const mockCategories: Category[] = [
//   {
//     id: '1',
//     name: 'Electronics',
//     description: 'Electronic devices and accessories',
//     imageUrl: 'https://example.com/electronics.jpg',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     subcategories: [
//       {
//         id: '1-1',
//         name: 'Smartphones',
//         description: 'Mobile phones and accessories',
//         imageUrl: 'https://example.com/smartphones.jpg',
//         categoryId: '1',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ],
//   },
// ];

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>(mockCategories);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
//   const { toast } = useToast();

//   const handleAddCategory = async (formData: FormData) => {
//     try {
//       // In a real app, you would make an API call here
//       const newCategory: Category = {
//         id: Math.random().toString(),
//         name: formData.get('name') as string,
//         description: formData.get('description') as string,
//         imageUrl: URL.createObjectURL(formData.get('image') as File),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         subcategories: [],
//       };

//       setCategories([...categories, newCategory]);
//       setIsAddOpen(false);
//       toast({
//         title: 'Success',
//         description: 'Category added successfully',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to add category',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleEditCategory = async (formData: FormData) => {
//     if (!selectedCategory) return;

//     try {
//       // In a real app, you would make an API call here
//       const updatedCategory: Category = {
//         ...selectedCategory,
//         name: formData.get('name') as string,
//         description: formData.get('description') as string,
//         imageUrl: formData.get('image') 
//           ? URL.createObjectURL(formData.get('image') as File)
//           : selectedCategory.imageUrl,
//         updatedAt: new Date().toISOString(),
//       };

//       setCategories(categories.map(cat => 
//         cat.id === selectedCategory.id ? updatedCategory : cat
//       ));
//       setIsEditOpen(false);
//       setSelectedCategory(null);
//       toast({
//         title: 'Success',
//         description: 'Category updated successfully',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to update category',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleDeleteCategory = async () => {
//     if (!selectedCategory) return;

//     try {
//       // In a real app, you would make an API call here
//       setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
//       setIsDeleteOpen(false);
//       setSelectedCategory(null);
//       toast({
//         title: 'Success',
//         description: 'Category deleted successfully',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to delete category',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleAddSubcategory = async (formData: FormData) => {
//     if (!selectedCategory) return;

//     try {
//       // In a real app, you would make an API call here
//       const newSubcategory = {
//         id: Math.random().toString(),
//         name: formData.get('name') as string,
//         description: formData.get('description') as string,
//         imageUrl: URL.createObjectURL(formData.get('image') as File),
//         categoryId: selectedCategory.id,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       const updatedCategory = {
//         ...selectedCategory,
//         subcategories: [...selectedCategory.subcategories, newSubcategory],
//       };

//       setCategories(categories.map(cat => 
//         cat.id === selectedCategory.id ? updatedCategory : cat
//       ));
//       setIsAddSubcategoryOpen(false);
//       toast({
//         title: 'Success',
//         description: 'Subcategory added successfully',
//       });
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to add subcategory',
//         variant: 'destructive',
//       });
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Categories</h1>
//           <p className="text-muted-foreground">
//             Manage your product categories and subcategories
//           </p>
//         </div>
//         <Button onClick={() => setIsAddOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Category
//         </Button>
//       </div>

//       <CategoryTable
//         categories={categories}
//         onEdit={(category) => {
//           setSelectedCategory(category);
//           setIsEditOpen(true);
//         }}
//         onDelete={(category) => {
//           setSelectedCategory(category);
//           setIsDeleteOpen(true);
//         }}
//         onAddSubcategory={(category) => {
//           setSelectedCategory(category);
//           setIsAddSubcategoryOpen(true);
//         }}
//       />

//       <AddCategoryDialog
//         open={isAddOpen}
//         onOpenChange={setIsAddOpen}
//         onSubmit={handleAddCategory}
//       />

//       <EditCategoryDialog
//         open={isEditOpen}
//         onOpenChange={setIsEditOpen}
//         category={selectedCategory}
//         onSubmit={handleEditCategory}
//       />

//       <DeleteCategoryDialog
//         open={isDeleteOpen}
//         onOpenChange={setIsDeleteOpen}
//         category={selectedCategory}
//         onConfirm={handleDeleteCategory}
//       />

//       <AddSubcategoryDialog
//         open={isAddSubcategoryOpen}
//         onOpenChange={setIsAddSubcategoryOpen}
//         category={selectedCategory}
//         onSubmit={handleAddSubcategory}
//       />
//     </div>
//   );
// }