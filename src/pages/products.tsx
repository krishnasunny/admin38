import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductTable } from "@/components/products/product-table";
import { ProductForm } from "@/components/products/product-form";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductPagination } from "@/components/products/product-pagination";
import { ProductBatchActions } from "@/components/products/product-batch-actions";
import {
  Product,
  ProductFilters as FilterState,
  ProductSort,
  PaginationState,
  ProductStatus,
  CreateProductPayload,
} from "@/lib/types/product";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { url } from "@/lib/utils";
import { Category, Subcategory } from "@/lib/types/category";
import { useAuthStore } from "@/lib/store";

export function ProductsPage() {
// categories and subcategories

const [categories, setCategories] = useState<Category[]>([]);
const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
// const [isLoading, setIsLoading] = useState(true);
const user = useAuthStore((state) => state.user);

useEffect(() => {
  console.log(user);
  const fetchData = async () => {
    // setIsLoading(true);
    await Promise.all([fetchCategories(), fetchSubcategories()]);
    // setIsLoading(false);
  };

  fetchData();
}, []);

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url.api}/api/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCategories(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const fetchSubcategories = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url.api}/api/subcategories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSubcategories(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subcategories:", error);
    return [];
  }
};

// categories and subcategories

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category_name: "all",
    status: "all",
  });
  const [sort
    // ,setSort
  ] = useState<ProductSort>({
    field: "created_at",
    order: "desc",
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(user?.role=="super_admin"?`${url.api}/api/products`:`${url.api}/api/products/vendor/${user?.vendor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    const token = localStorage.getItem("token");
    console.log("ram")
    console.log(data)

    try {
      // Step 1: Convert base64 strings to File objects if needed
      const formData = new FormData();

      const processImages = data.images.map((image: any) => {
        // Check if the image is already a File object
        if (image instanceof File) {
          return image;
        }

        // If it's a base64 string, convert it to a File
        if (typeof image === "string" && image.startsWith("data:")) {
          // Extract mime type and base64 data
          const arr = image.split(",");
          // const mime = arr[0].match(/:(.*?);/)[1];
          const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          // Create a File object
          return new File(
            [u8arr],
            `image-${Date.now()}.${mime.split("/")[1]}`,
            { type: mime }
          );
        }

        // Return original if not base64 or File
        return image;
      });

      // Append each processed file to FormData
      processImages.forEach((file: File) => {
        formData.append("files", file);
      });

      console.log("FormData prepared:", formData);

      // Step 2: Upload files
      const uploadResponse = await fetch(`${url.api}/api/upload-multiple`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Files upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);

      let imgx = uploadResult.images.map((url: any, index: any) => ({
        url: url.imageUrl,
        is_primary: index === 0,
      }));

      console.log(imgx);

      const productData: CreateProductPayload = {
        vendor_id: user?.vendor_id || 1,
        category_id: Number(data.category_id),
        subcategory_id: data.subcategory_id,
        product_name: data.product_name,
        description: data.description,
        base_price: Number(data.base_price),
        sku: data.sku,
        variants: data.variants.map((variant: any) => ({
          name: variant.name,
          price: Number(variant.price),
          stock_quantity: Number(variant.stock_quantity),
          sku: variant.sku,
        })),
        images: uploadResult.images.map((url: any, index: any) => ({
          url: url.imageUrl,
          is_primary: index === 0,
        })),
      };

      const response = await axios.post(
        `${url.api}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.status);
      fetchProducts();
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error: any) {
      console.error("Create product error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create product",
        variant: "destructive",
      });
    }
  };

  // const handleUpdate = async (data: any) => {
  //   if (!selectedProduct) return;

  //   try {
  //     const token = localStorage.getItem("token");

  //     const productData = {
  //       vendor_id: 8,
  //       category_id: Number(data.category_id),
  //       subcategory_id: data.subcategory_id,
  //       product_name: data.product_name,
  //       description: data.description,
  //       base_price: Number(data.base_price),
  //       sku: data.sku,
  //       variants: data.variants.map((variant: any) => ({
  //         name: variant.name,
  //         price: Number(variant.price),
  //         stock_quantity: Number(variant.stock_quantity),
  //         sku: variant.sku,
  //       })),
  //       // images
  //     };

  //     console.log(productData);

  //     const response = await axios.put(
  //       `${url.api}/api/products/${selectedProduct.product_id}`,
  //       productData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // setProducts(
  //     //   products.map((p) =>
  //     //     p.product_id === selectedProduct.product_id ? response.data : p
  //     //   )
  //     // );
  //     console.log(response.status);
  //     fetchProducts();
  //     setIsFormOpen(false);
  //     setSelectedProduct(null);
  //     toast({
  //       title: "Success",
  //       description: "Product updated successfully",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description:
  //         error.response?.data?.message || "Failed to update product",
  //       variant: "destructive",
  //     });
  //   }
  // };

// const handleUpdate = async (data: any) => {
//   if (!selectedProduct) return;
  
//   const token = localStorage.getItem("token");
//   console.log("Updating product");
//   console.log(data);
  
//   try {
//     // Step 1: Process images - convert base64 strings to File objects
//     const formData = new FormData();
    
//     // Only process images if they exist and have changed
//     if (data.images && data.images.length > 0) {
//       const processImages = data.images.map((image: any) => {
//         // Check if the image is already a File object
//         if (image instanceof File) {
//           return image;
//         }
        
//         // If it's a base64 string, convert it to a File
//         if (typeof image === "string" && image.startsWith("data:")) {
//           // Extract mime type and base64 data
//           const arr = image.split(",");
//           const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
//           const bstr = atob(arr[1]);
//           let n = bstr.length;
//           const u8arr = new Uint8Array(n);
          
//           while (n--) {
//             u8arr[n] = bstr.charCodeAt(n);
//           }
          
//           // Create a File object
//           return new File(
//             [u8arr],
//             `image-${Date.now()}.${mime.split("/")[1]}`,
//             { type: mime }
//           );
//         }
        
//         // Return original if not base64 or File
//         return image;
//       });
      
//       // Append each processed file to FormData
//       processImages.forEach((file: File) => {
//         formData.append("files", file);
//       });
      
//       console.log("FormData prepared:", formData);
      
//       // Step 2: Upload files if new images were provided
//       const uploadResponse = await fetch(`${url.api}/api/upload-multiple`, {
//         method: "POST",
//         body: formData,
//       });
      
//       if (!uploadResponse.ok) {
//         throw new Error(
//           `Files upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
//         );
//       }
      
//       const uploadResult = await uploadResponse.json();
//       console.log("Upload result:", uploadResult);
      
//       // Step 3: Prepare product data with new images
//       const productData = {
//         vendor_id: 8,
//         category_id: Number(data.category_id),
//         subcategory_id: data.subcategory_id,
//         product_name: data.product_name,
//         description: data.description,
//         base_price: Number(data.base_price),
//         sku: data.sku,
//         variants: data.variants.map((variant: any) => ({
//           name: variant.name,
//           price: Number(variant.price),
//           stock_quantity: Number(variant.stock_quantity),
//           sku: variant.sku,
//         })),
//         images: uploadResult.images.map((url: any, index: any) => ({
//           url: url.imageUrl,
//           is_primary: index === 0,
//         })),
//       };
      
//       console.log("Product data with new images:", productData);
      
//       // Step 4: Update the product
//       const response = await axios.put(
//         `${url.api}/api/products/${selectedProduct.product_id}`,
//         productData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     } else {
//       // If no new images, just update the product data without images
//       const productData = {
//         vendor_id: 8,
//         category_id: Number(data.category_id),
//         subcategory_id: data.subcategory_id,
//         product_name: data.product_name,
//         description: data.description,
//         base_price: Number(data.base_price),
//         sku: data.sku,
//         variants: data.variants.map((variant: any) => ({
//           name: variant.name,
//           price: Number(variant.price),
//           stock_quantity: Number(variant.stock_quantity),
//           sku: variant.sku,
//         })),
//       };
      
//       console.log("Product data without image updates:", productData);
      
//       const response = await axios.put(
//         `${url.api}/api/products/${selectedProduct.product_id}`,
//         productData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }
    
//     fetchProducts();
//     setIsFormOpen(false);
//     setSelectedProduct(null);
//     toast({
//       title: "Success",
//       description: "Product updated successfully",
//     });
//   } catch (error: any) {
//     console.error("Update product error:", error);
//     toast({
//       title: "Error",
//       description:
//         error.response?.data?.message || "Failed to update product",
//       variant: "destructive",
//     });
//   }
// };

const handleUpdate = async (data: any) => {
  if (!selectedProduct) return;
  
  const token = localStorage.getItem("token");
  console.log("Updating product with images:", data.images);
  
  try {
    // Track existing and new images
    let finalImageList = [];
    let hasNewImages = false;
    
    // Step 1: Identify existing image URLs vs new File/base64 images
    const existingImageUrls: string[] = [];
    const newImageData: (string | File)[] = [];
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image: any) => {
        // If it's a string URL that doesn't start with data: (not base64)
        if (typeof image === "string" && !image.startsWith("data:")) {
          // This is an existing image URL from the server
          existingImageUrls.push(image);
        } else if (image instanceof File || (typeof image === "string" && image.startsWith("data:"))) {
          // This is a new image (File object or base64)
          newImageData.push(image);
          hasNewImages = true;
        }
      });
    }
    
    // Convert existing image URLs to the format expected by the API
    const existingImagesFormatted = existingImageUrls.map((url: string, index: number) => ({
      url: url,
      is_primary: index === 0 && newImageData.length === 0, // Only make primary if no new images
    }));
    
    // Step 2: Process and upload new images if any
    if (hasNewImages) {
      const formData = new FormData();
      
      // Process new images (File objects or base64 strings)
      const processedNewImages = newImageData.map((image: any) => {
        // If already a File object
        if (image instanceof File) {
          return image;
        }
        
        // If base64 string, convert to File
        if (typeof image === "string" && image.startsWith("data:")) {
          const arr = image.split(",");
          const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          
          return new File(
            [u8arr],
            `image-${Date.now()}.${mime.split("/")[1]}`,
            { type: mime }
          );
        }
        
        return null;
      }).filter(Boolean); // Remove nulls
      
      // Append each file to FormData
      processedNewImages.forEach((file:any) => {
        formData.append("files", file);
      });
      
      // Upload the new files
      const uploadResponse = await fetch(`${url.api}/api/upload-multiple`, {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error(
          `Files upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }
      
      const uploadResult = await uploadResponse.json();
      console.log("New images upload result:", uploadResult);
      
      // Format new uploaded images
      const newImagesFormatted = uploadResult.images.map((img: any, index: number) => ({
        url: img.imageUrl,
        is_primary: existingImagesFormatted.length === 0 && index === 0, // Make first new image primary if no existing images
      }));
      
      // Combine existing and new images
      finalImageList = [...existingImagesFormatted, ...newImagesFormatted];
    } else {
      // Only using existing images
      finalImageList = existingImagesFormatted;
    }
    
    // Ensure at least one image is marked as primary
    if (finalImageList.length > 0 && !finalImageList.some(img => img.is_primary)) {
      finalImageList[0].is_primary = true;
    }
    
    console.log("Final image list for update:", finalImageList);
    
    // Step 3: Prepare and send product data
    const productData = {
      vendor_id: 8,
      category_id: Number(data.category_id),
      subcategory_id: data.subcategory_id,
      product_name: data.product_name,
      description: data.description,
      base_price: Number(data.base_price),
      sku: data.sku,
      variants: data.variants.map((variant: any) => ({
        name: variant.name,
        price: Number(variant.price),
        stock_quantity: Number(variant.stock_quantity),
        sku: variant.sku,
      })),
      images: finalImageList,
    };
    
    console.log("Final product data for update:", productData);
    
    // const response = 
    await axios.put(
      `${url.api}/api/products/${selectedProduct.product_id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    fetchProducts();
    setIsFormOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  } catch (error: any) {
    console.error("Update product error:", error);
    toast({
      title: "Error",
      description:
        error.response?.data?.message || "Failed to update product",
      variant: "destructive",
    });
  }
};

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${url.api}/api/products/${selectedProduct.product_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(products.filter((p) => p.product_id !== selectedProduct.product_id));
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleBatchStatusUpdate = async (
    productIds: string[],
    status: ProductStatus
  ) => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        productIds.map((id) =>
          axios.put(
            `${url.api}/api/products/${id}`,
            { status },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      setProducts(
        products.map((product) =>
          productIds.includes(product.product_id.toString())
            ? { ...product, status }
            : product
        )
      );
      setSelectedIds([]);
      toast({
        title: "Success",
        description: `Selected products have been marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update products",
        variant: "destructive",
      });
    }
  };

  const handleBatchDelete = async (productIds: string[]) => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        productIds.map((id) =>
          axios.delete(`${url.api}/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setProducts(products.filter((product) => !productIds.includes(product.product_id.toString())));
      setSelectedIds([]);
      toast({
        title: "Success",
        description: "Selected products have been deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete products",
        variant: "destructive",
      });
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.product_name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.sku.toLowerCase().includes(filters.search.toLowerCase());
        const matchesCategory =
          filters.category_name === "all" ||
          product.category_name.toString() === filters.category_name;
        const matchesStatus =
          filters.status === "all" || product.status === filters.status;
        const matchesPrice =
          (!filters.minPrice ||
            Number(product.base_price) >= filters.minPrice) &&
          (!filters.maxPrice || Number(product.base_price) <= filters.maxPrice);

        return (
          matchesSearch && matchesCategory && matchesStatus && matchesPrice
        );
      })
      .sort((a, b) => {
        const multiplier = sort.order === "asc" ? 1 : -1;
        if (sort.field === "created_at") {
          return (
            multiplier *
            (new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime())
          );
        }
        return (
          multiplier *
          ((a[sort.field] as any) > (b[sort.field] as any) ? 1 : -1)
        );
      });
  }, [products, filters, sort]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, pagination]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductFilters filters={filters} onFilterChange={setFilters} categories={categories} />

      <ProductBatchActions
        products={products}
        selectedIds={selectedIds}
        onSelectAll={(selected) => {
          setSelectedIds(selected ? products.map((p) => p.product_id.toString()) : []);
        }}
        onSelectOne={(productId, selected) => {
          setSelectedIds(
            selected
              ? [...selectedIds, productId]
              : selectedIds.filter((id) => id !== productId)
          );
        }}
        onUpdateStatus={handleBatchStatusUpdate}
        onDeleteMany={handleBatchDelete}
      />

      <ProductTable
        products={paginatedProducts}
        selectedIds={selectedIds}
        onSelectOne={(productId, selected) => {
          setSelectedIds(
            selected
              ? [...selectedIds, productId]
              : selectedIds.filter((id) => id !== productId)
          );
        }}
        onEdit={(product) => {
          setSelectedProduct(product);
          setIsFormOpen(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
          setIsDeleteDialogOpen(true);
        }}
      />

      <ProductPagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={filteredProducts.length}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={
              selectedProduct
                ? {
                    status: 'active',
                    category_id: selectedProduct.category_id,
                    subcategory_id: selectedProduct.subcategory_id,
                    product_name: selectedProduct.product_name,
                    description: selectedProduct.description,
                    base_price: parseFloat(`${selectedProduct.base_price}`),
                    sku: selectedProduct.sku,
                    images: selectedProduct.images.map((img) => img.image_url),
                    variants: selectedProduct.variants
                      // .filter((v) => typeof v.sku === "string") // remove undefined sku
                      .map((variant) => ({
                        sku: variant.sku ?? "", // fallback to empty string if undefined
                        name: variant.variant_name,
                        price: variant.variant_price,
                        stock_quantity: variant.stock_quantity,
                      })),
                  }
                : undefined
            }
            onSubmit={selectedProduct ? handleUpdate : handleCreate}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedProduct(null);
            }}
            categories={categories}
            subcategories={subcategories}
            
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProduct(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// import { useState, useMemo, useEffect } from "react";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { ProductTable } from "@/components/products/product-table";
// import { ProductForm } from "@/components/products/product-form";
// import { ProductFilters } from "@/components/products/product-filters";
// import { ProductPagination } from "@/components/products/product-pagination";
// import { ProductBatchActions } from "@/components/products/product-batch-actions";
// import {
//   Product,
//   ProductFilters as FilterState,
//   ProductSort,
//   PaginationState,
//   ProductStatus,
// } from "@/lib/types/product";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";

// export function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [filters, setFilters] = useState<FilterState>({
//     search: "",
//     category: "all",
//     status: "all",
//   });
//   const [sort, setSort] = useState<ProductSort>({
//     field: "createdAt",
//     order: "desc",
//   });
//   const [pagination, setPagination] = useState<PaginationState>({
//     page: 1,
//     pageSize: 10,
//   });
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:3000/api/products", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setProducts(response.data);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch products",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function uploadImage(image: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//       // if (!image || !image.type.startsWith("image/")) {
//         if (!image || typeof image.type !== "string" || !image.type.startsWith("image/")) {

//         toast({
//           title: "Error",
//           description: "Please select a valid image file",
//           variant: "destructive",
//         });
//         return reject("Invalid file");
//       }

//       const fileType = image.type.split("/")[1];
//       const fileName = `${Date.now()}_product.${fileType}`;
//       const newFile = new File([image], fileName, { type: image.type });
//       const formData = new FormData();

//       formData.append("testId", "product");
//       formData.append("file", newFile);

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
//           toast({
//             title: "Error",
//             description: `Error uploading image: ${err.message}`,
//             variant: "destructive",
//           });
//           reject(err);
//         });
//     });
//   }

//   const handleCreate = async (data: any) => {
//     try {
//       const token = localStorage.getItem("token");

//       // Upload images
//       const imagePromises = data.images.map((image: File) => uploadImage(image));
//       const imageUrls = await Promise.all(imagePromises);

//       const productData = {
//         ...data,
//         images: imageUrls.map((url, index) => ({
//           url,
//           is_primary: index === 0
//         }))
//       };

//       const response = await axios.post(
//         "http://localhost:3000/api/products",
//         productData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setProducts([response.data, ...products]);
//       setIsFormOpen(false);
//       toast({
//         title: "Success",
//         description: "Product created successfully",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to create product",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleUpdate = async (data: any) => {
//     if (!selectedProduct) return;

//     try {
//       const token = localStorage.getItem("token");

//       // Handle new images
//       const newImages = data.images.filter((img: any) => img instanceof File);
//       const existingImages = data.images.filter((img: any) => typeof img === 'string');

//       // Upload new images
//       const imagePromises = newImages.map((image: File) => uploadImage(image));
//       const newImageUrls = await Promise.all(imagePromises);

//       const productData = {
//         ...data,
//         images: [
//           ...existingImages.map((url: string, index: number) => ({
//             url,
//             is_primary: index === 0 && newImageUrls.length === 0
//           })),
//           ...newImageUrls.map((url, index) => ({
//             url,
//             is_primary: index === 0 && existingImages.length === 0
//           }))
//         ]
//       };

//       const response = await axios.put(
//         `http://localhost:3000/api/products/${selectedProduct.product_id}`,
//         productData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setProducts(
//         products.map((p) => (p.product_id === selectedProduct.product_id ? response.data : p))
//       );
//       setIsFormOpen(false);
//       setSelectedProduct(null);
//       toast({
//         title: "Success",
//         description: "Product updated successfully",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update product",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedProduct) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(
//         `http://localhost:3000/api/products/${selectedProduct.product_id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setProducts(products.filter((p) => p.product_id !== selectedProduct.product_id));
//       setIsDeleteDialogOpen(false);
//       setSelectedProduct(null);
//       toast({
//         title: "Success",
//         description: "Product deleted successfully",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete product",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleBatchStatusUpdate = async (
//     productIds: string[],
//     status: ProductStatus
//   ) => {
//     try {
//       const token = localStorage.getItem("token");
//       await Promise.all(
//         productIds.map((id) =>
//           axios.put(
//             `http://localhost:3000/api/products/${id}`,
//             { status },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           )
//         )
//       );

//       setProducts(
//         products.map((product) =>
//           productIds.includes(product.product_id)
//             ? { ...product, status }
//             : product
//         )
//       );
//       setSelectedIds([]);
//       toast({
//         title: "Success",
//         description: `Selected products have been marked as ${status}`,
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update products",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleBatchDelete = async (productIds: string[]) => {
//     try {
//       const token = localStorage.getItem("token");
//       await Promise.all(
//         productIds.map((id) =>
//           axios.delete(`http://localhost:3000/api/products/${id}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//         )
//       );

//       setProducts(products.filter((product) => !productIds.includes(product.product_id)));
//       setSelectedIds([]);
//       toast({
//         title: "Success",
//         description: "Selected products have been deleted",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete products",
//         variant: "destructive",
//       });
//     }
//   };

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesSearch =
//           product.product_name.toLowerCase().includes(filters.search.toLowerCase()) ||
//           product.sku.toLowerCase().includes(filters.search.toLowerCase());
//         const matchesCategory =
//           filters.category === "all" || product.category_id.toString() === filters.category;
//         const matchesStatus =
//           filters.status === "all" || product.status === filters.status;
//         const matchesPrice =
//           (!filters.minPrice || product.base_price >= filters.minPrice) &&
//           (!filters.maxPrice || product.base_price <= filters.maxPrice);

//         return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
//       })
//       .sort((a, b) => {
//         const multiplier = sort.order === "asc" ? 1 : -1;
//         if (sort.field === "createdAt") {
//           return (
//             multiplier *
//             (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
//           );
//         }
//         return multiplier * ((a[sort.field] as any) > (b[sort.field] as any) ? 1 : -1);
//       });
//   }, [products, filters, sort]);

//   // Paginate products
//   const paginatedProducts = useMemo(() => {
//     const start = (pagination.page - 1) * pagination.pageSize;
//     const end = start + pagination.pageSize;
//     return filteredProducts.slice(start, end);
//   }, [filteredProducts, pagination]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <Button onClick={() => setIsFormOpen(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Product
//         </Button>
//       </div>

//       <ProductFilters filters={filters} onFilterChange={setFilters} />

//       <ProductBatchActions
//         products={products}
//         selectedIds={selectedIds}
//         onSelectAll={(selected) => {
//           setSelectedIds(selected ? products.map((p) => p.product_id) : []);
//         }}
//         onSelectOne={(productId, selected) => {
//           setSelectedIds(
//             selected
//               ? [...selectedIds, productId]
//               : selectedIds.filter((id) => id !== productId)
//           );
//         }}
//         onUpdateStatus={handleBatchStatusUpdate}
//         onDeleteMany={handleBatchDelete}
//       />

//       <ProductTable
//         products={paginatedProducts}
//         selectedIds={selectedIds}
//         onSelectOne={(productId, selected) => {
//           setSelectedIds(
//             selected
//               ? [...selectedIds, productId]
//               : selectedIds.filter((id) => id !== productId)
//           );
//         }}
//         onEdit={(product) => {
//           setSelectedProduct(product);
//           setIsFormOpen(true);
//         }}
//         onDelete={(product) => {
//           console.log("Asfda");
//           setSelectedProduct(product);
//           setIsDeleteDialogOpen(true);
//         }}
//       />

//       <ProductPagination
//         currentPage={pagination.page}
//         pageSize={pagination.pageSize}
//         totalItems={filteredProducts.length}
//         onPageChange={(page) => setPagination({ ...pagination, page })}
//         onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
//       />

//       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               {selectedProduct ? "Edit Product" : "Add Product"}
//             </DialogTitle>
//           </DialogHeader>
//           <ProductForm
//             initialData={
//               selectedProduct
//                 ? {
//                     ...selectedProduct,
//                     images: selectedProduct.images.map((img) => img.image_url),
//                   }
//                 : undefined
//             }
//             onSubmit={selectedProduct ? handleUpdate : handleCreate}
//             onCancel={() => {
//               setIsFormOpen(false);
//               setSelectedProduct(null);
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       <AlertDialog
//         open={isDeleteDialogOpen}
//         onOpenChange={setIsDeleteDialogOpen}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Product</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this product? This action cannot
//               be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setSelectedProduct(null)}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// import { useState, useMemo } from "react";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { ProductTable } from "@/components/products/product-table";
// import { ProductForm } from "@/components/products/product-form";
// import { ProductFilters } from "@/components/products/product-filters";
// import { ProductPagination } from "@/components/products/product-pagination";
// import { ProductBatchActions } from "@/components/products/product-batch-actions";
// import {
//   Product,
//   ProductFilters as FilterState,
//   ProductSort,
//   PaginationState,
//   ProductStatus,
// } from "@/lib/types/product";
// import { useToast } from "@/hooks/use-toast";

// // Mock data - replace with actual API calls
// const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
//   id: (i + 1).toString(),
//   name: `Product ${i + 1}`,
//   description: `Description for product ${i + 1}`,
//   price: Math.floor(Math.random() * 1000) + 1,
//   category: ["electronics", "clothing", "books", "food", "other"][
//     Math.floor(Math.random() * 5)
//   ] as Product["category"],
//   status: ["active", "draft", "archived"][
//     Math.floor(Math.random() * 3)
//   ] as Product["status"],
//   stock: Math.floor(Math.random() * 100),
//   sku: `SKU-${i + 1}`,
//   images: [],
//   createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
//   updatedAt: new Date().toISOString(),
// }));

// export function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>(mockProducts);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [filters, setFilters] = useState<FilterState>({
//     search: "",
//     category: "all",
//     status: "all",
//   });
//   const [
//     sort,
//     // , setSort
//   ] = useState<ProductSort>({
//     field: "createdAt",
//     order: "desc",
//   });
//   const [pagination, setPagination] = useState<PaginationState>({
//     page: 1,
//     pageSize: 10,
//   });
//   const { toast } = useToast();

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     return products
//       .filter((product) => {
//         const matchesSearch =
//           product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//           product.sku.toLowerCase().includes(filters.search.toLowerCase());
//         const matchesCategory =
//           filters.category === "all" || product.category === filters.category;
//         const matchesStatus =
//           filters.status === "all" || product.status === filters.status;
//         const matchesPrice =
//           (!filters.minPrice || product.price >= filters.minPrice) &&
//           (!filters.maxPrice || product.price <= filters.maxPrice);

//         return (
//           matchesSearch && matchesCategory && matchesStatus && matchesPrice
//         );
//       })
//       .sort((a, b) => {
//         const multiplier = sort.order === "asc" ? 1 : -1;
//         if (sort.field === "createdAt") {
//           return (
//             multiplier *
//             (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
//           );
//         }
//         return (
//           multiplier *
//           ((a[sort.field] as any) > (b[sort.field] as any) ? 1 : -1)
//         );
//       });
//   }, [products, filters, sort]);

//   // Paginate products
//   const paginatedProducts = useMemo(() => {
//     const start = (pagination.page - 1) * pagination.pageSize;
//     const end = start + pagination.pageSize;
//     return filteredProducts.slice(start, end);
//   }, [filteredProducts, pagination]);

//   const handleCreate = (data: any) => {
//     const newProduct: Product = {
//       ...data,
//       id: Math.random().toString(36).substr(2, 9),
//       images: [],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     setProducts([newProduct, ...products]);
//     setIsFormOpen(false);
//     toast({
//       title: "Product created",
//       description: "The product has been created successfully.",
//     });
//   };

//   const handleUpdate = (data: any) => {
//     if (!selectedProduct) return;
//     const updatedProduct: Product = {
//       ...selectedProduct,
//       ...data,
//       updatedAt: new Date().toISOString(),
//     };
//     setProducts(
//       products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
//     );
//     setIsFormOpen(false);
//     setSelectedProduct(null);
//     toast({
//       title: "Product updated",
//       description: "The product has been updated successfully.",
//     });
//   };

//   const handleDelete = () => {
//     if (!selectedProduct) return;
//     setProducts(products.filter((p) => p.id !== selectedProduct.id));
//     setIsDeleteDialogOpen(false);
//     setSelectedProduct(null);
//     toast({
//       title: "Product deleted",
//       description: "The product has been deleted successfully.",
//     });
//   };

//   const handleBatchStatusUpdate = (
//     productIds: string[],
//     status: ProductStatus
//   ) => {
//     setProducts(
//       products.map((product) =>
//         productIds.includes(product.id) ? { ...product, status } : product
//       )
//     );
//     setSelectedIds([]);
//     toast({
//       title: "Products updated",
//       description: `Selected products have been marked as ${status}.`,
//     });
//   };

//   const handleBatchDelete = (productIds: string[]) => {
//     setProducts(products.filter((product) => !productIds.includes(product.id)));
//     setSelectedIds([]);
//     toast({
//       title: "Products deleted",
//       description: "Selected products have been deleted.",
//     });
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <Button onClick={() => setIsFormOpen(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Product
//         </Button>
//       </div>

//       <ProductFilters filters={filters} onFilterChange={setFilters} />

//       <ProductBatchActions
//         products={products}
//         selectedIds={selectedIds}
//         onSelectAll={(selected) => {
//           setSelectedIds(selected ? products.map((p) => p.id) : []);
//         }}
//         onSelectOne={(productId, selected) => {
//           setSelectedIds(
//             selected
//               ? [...selectedIds, productId]
//               : selectedIds.filter((id) => id !== productId)
//           );
//         }}
//         onUpdateStatus={handleBatchStatusUpdate}
//         onDeleteMany={handleBatchDelete}
//       />

//       <ProductTable
//         products={paginatedProducts}
//         selectedIds={selectedIds}
//         onSelectOne={(productId, selected) => {
//           setSelectedIds(
//             selected
//               ? [...selectedIds, productId]
//               : selectedIds.filter((id) => id !== productId)
//           );
//         }}
//         onEdit={(product) => {
//           setSelectedProduct(product);
//           setIsFormOpen(true);
//         }}
//         onDelete={(product) => {
//           setSelectedProduct(product);
//           setIsDeleteDialogOpen(true);
//         }}
//       />

//       <ProductPagination
//         currentPage={pagination.page}
//         pageSize={pagination.pageSize}
//         totalItems={filteredProducts.length}
//         onPageChange={(page) => setPagination({ ...pagination, page })}
//         onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
//       />

//       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               {selectedProduct ? "Edit Product" : "Add Product"}
//             </DialogTitle>
//           </DialogHeader>
//           <ProductForm
//             // initialData={selectedProduct || undefined}
//             initialData={
//               selectedProduct
//                 ? {
//                     ...selectedProduct,
//                     images: selectedProduct.images.map((img) => img.url),
//                   }
//                 : undefined
//             }
//             onSubmit={selectedProduct ? handleUpdate : handleCreate}
//             onCancel={() => {
//               setIsFormOpen(false);
//               setSelectedProduct(null);
//             }}
//           />
//         </DialogContent>
//       </Dialog>

//       <AlertDialog
//         open={isDeleteDialogOpen}
//         onOpenChange={setIsDeleteDialogOpen}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Product</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this product? This action cannot
//               be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setSelectedProduct(null)}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
